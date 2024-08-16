#include <iostream>
#include <string>
#include <Windows.h>
#include <sql.h>
#include <sqlext.h>
#include <sqltypes.h>

using namespace std;

// Hàm kết nối với SQL Server và lưu dữ liệu vào bảng SensorData
bool insertDataToSQLServer(string temperature, string humidity, string dustDensity, string mq7Value, string lightValue, string rainValue) {
    SQLHANDLE sqlEnvHandle;
    SQLHANDLE sqlConnHandle;
    SQLHANDLE sqlStmtHandle;
    SQLRETURN retCode = 0;

    if (SQL_SUCCESS != SQLAllocHandle(SQL_HANDLE_ENV, SQL_NULL_HANDLE, &sqlEnvHandle))
        return false;

    if (SQL_SUCCESS != SQLSetEnvAttr(sqlEnvHandle, SQL_ATTR_ODBC_VERSION, (SQLPOINTER)SQL_OV_ODBC3, 0))
        return false;

    if (SQL_SUCCESS != SQLAllocHandle(SQL_HANDLE_DBC, sqlEnvHandle, &sqlConnHandle))
        return false;

    SQLCHAR retConString[1024];
    switch (SQLDriverConnect(sqlConnHandle, NULL,
           (SQLCHAR*)"DRIVER={SQL Server};SERVER=SQL8020.site4now.net;DATABASE=db_aac032_yunomix2834;UID=db_aac032_yunomix2834_admin;PWD=dinhanst2832004;",
           SQL_NTS, retConString, 1024, NULL, SQL_DRIVER_NOPROMPT)) {
        case SQL_SUCCESS_WITH_INFO:
        case SQL_SUCCESS:
            break;
        case SQL_INVALID_HANDLE:
        case SQL_ERROR:
            return false;
        default:
            break;
           }

    if (SQL_SUCCESS != SQLAllocHandle(SQL_HANDLE_STMT, sqlConnHandle, &sqlStmtHandle))
        return false;

    string query = "INSERT INTO SensorData (Temperature, Humidity, DustDensity, MQ7, Light, Rain) VALUES ('" +
                   temperature + "', '" + humidity + "', '" + dustDensity + "', '" + mq7Value + "', '" + lightValue + "', '" + rainValue + "')";

    if (SQL_SUCCESS != SQLExecDirect(sqlStmtHandle, (SQLCHAR*)query.c_str(), SQL_NTS)) {
        return false;
    }

    SQLFreeHandle(SQL_HANDLE_STMT, sqlStmtHandle);
    SQLDisconnect(sqlConnHandle);
    SQLFreeHandle(SQL_HANDLE_DBC, sqlConnHandle);
    SQLFreeHandle(SQL_HANDLE_ENV, sqlEnvHandle);

    return true;
}

int main() {
    HANDLE hSerial;
    hSerial = CreateFile("COM3", GENERIC_READ | GENERIC_WRITE, 0, 0, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, 0);

    if (hSerial == INVALID_HANDLE_VALUE) {
        DWORD dwError = GetLastError();
        cerr << "Failed to open COM port. Error code: " << dwError << endl;

        if (dwError == ERROR_FILE_NOT_FOUND) {
            cerr << "The specified COM port does not exist." << endl;
        } else if (dwError == ERROR_ACCESS_DENIED) {
            cerr << "The COM port is already in use." << endl;
        } else {
            cerr << "An unknown error occurred." << endl;
        }

        return 1;
    }

    DCB dcbSerialParams = { 0 };
    dcbSerialParams.DCBlength = sizeof(dcbSerialParams);
    GetCommState(hSerial, &dcbSerialParams);
    dcbSerialParams.BaudRate = CBR_9600;
    dcbSerialParams.ByteSize = 8;
    dcbSerialParams.StopBits = ONESTOPBIT;
    dcbSerialParams.Parity = NOPARITY;
    SetCommState(hSerial, &dcbSerialParams);

    COMMTIMEOUTS timeouts = { 0 };
    timeouts.ReadIntervalTimeout = 50;
    timeouts.ReadTotalTimeoutConstant = 50;
    timeouts.ReadTotalTimeoutMultiplier = 10;
    timeouts.WriteTotalTimeoutConstant = 50;
    timeouts.WriteTotalTimeoutMultiplier = 10;
    SetCommTimeouts(hSerial, &timeouts);

    char buffer[256];
    DWORD bytesRead;
    while (true) {
        if (ReadFile(hSerial, buffer, sizeof(buffer), &bytesRead, NULL)) {
            buffer[bytesRead] = '\0';
            string data(buffer);

            cout << "Received data: " << data << endl;  // Kiểm tra dữ liệu nhận được

            // Kiểm tra xem chuỗi có chứa tất cả các phần cần thiết không
            if (data.find("Temp=") != string::npos &&
                data.find(",Humid=") != string::npos &&
                data.find(",Dust=") != string::npos &&
                data.find(",MQ7=") != string::npos &&
                data.find(",Light=") != string::npos &&
                data.find(",Rain=") != string::npos) {

                // Xử lý chuỗi
                size_t tempPos = data.find("Temp=");
                size_t humidPos = data.find(",Humid=");
                size_t dustPos = data.find(",Dust=");
                size_t mq7Pos = data.find(",MQ7=");
                size_t lightPos = data.find(",Light=");
                size_t rainPos = data.find(",Rain=");

                string temperature = data.substr(tempPos + 5, humidPos - (tempPos + 5));
                string humidity = data.substr(humidPos + 7, dustPos - (humidPos + 7));
                string dustDensity = data.substr(dustPos + 6, mq7Pos - (dustPos + 6));
                string mq7Value = data.substr(mq7Pos + 5, lightPos - (mq7Pos + 5));
                string lightValue = data.substr(lightPos + 7, rainPos - (lightPos + 7));
                string rainValue = data.substr(rainPos + 5);

                if (insertDataToSQLServer(temperature, humidity, dustDensity, mq7Value, lightValue, rainValue)) {
                    cout << "Data saved to SQL Server: " << data << endl;
                } else {
                    cerr << "Failed to save data to SQL Server" << endl;
                }
            } else {
                cerr << "Data format error: missing one or more expected values." << endl;
            }
        }
    }

    CloseHandle(hSerial);
    return 0;
}
