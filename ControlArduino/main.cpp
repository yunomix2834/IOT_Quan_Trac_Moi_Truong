#include <iostream>
#include <string>
#include <Windows.h>
#include <sql.h>
#include <sqlext.h>
#include <sqltypes.h>
#include <sstream>

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
        (SQLCHAR*)"DRIVER={SQL Server};SERVER=DESKTOP-0RANDIB;DATABASE=ControllerArduino;UID=sa;PWD=dinhanst2832004;",
        SQL_NTS, retConString, 1024, NULL, SQL_DRIVER_NOPROMPT)) {
        case SQL_SUCCESS_WITH_INFO:
        case SQL_SUCCESS:
            break;
        case SQL_INVALID_HANDLE:
        case SQL_ERROR:
            cerr << "Error connecting to SQL Server." << endl;
            return false;
        default:
            break;
    }

    if (SQL_SUCCESS != SQLAllocHandle(SQL_HANDLE_STMT, sqlConnHandle, &sqlStmtHandle))
        return false;

    // Clean any unwanted characters from the data
    string cleanedRainValue = rainValue;
    if (rainValue.find('=') != string::npos) {
        cleanedRainValue = rainValue.substr(rainValue.find('=') + 1);  // Remove any '=' from the rain value
    }

    string query = "INSERT INTO SensorData (Temperature, Humidity, DustDensity, MQ7, Light, Rain) VALUES ('" +
        temperature + "', '" + humidity + "', '" + dustDensity + "', '" + mq7Value + "', '" + lightValue + "', '" + cleanedRainValue + "')";

    if (SQL_SUCCESS != SQLExecDirect(sqlStmtHandle, (SQLCHAR*)query.c_str(), SQL_NTS)) {
        cerr << "SQL insertion failed. Query: " << query << endl;
        SQLFreeHandle(SQL_HANDLE_STMT, sqlStmtHandle);
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
        cerr << "Failed to open COM port." << endl;
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
    timeouts.ReadTotalTimeoutConstant = 1000;  // Increase the read timeout to ensure full data is received
    timeouts.ReadTotalTimeoutMultiplier = 10;
    SetCommTimeouts(hSerial, &timeouts);

    char buffer[256];
    DWORD bytesRead;
    string dataBuffer = "";

    while (true) {
        if (ReadFile(hSerial, buffer, sizeof(buffer), &bytesRead, NULL)) {
            buffer[bytesRead] = '\0';
            dataBuffer += string(buffer);

            if (dataBuffer.find('\n') != string::npos) {
                cout << "Received data: " << dataBuffer << endl;

                // Kiểm tra xem chuỗi có chứa tất cả các phần cần thiết không
                if (dataBuffer.find("Temp=") != string::npos &&
                    dataBuffer.find(",Humid=") != string::npos &&
                    dataBuffer.find(",Dust=") != string::npos &&
                    dataBuffer.find(",MQ7=") != string::npos &&
                    dataBuffer.find(",Light=") != string::npos &&
                    dataBuffer.find(",Rain=") != string::npos) {

                    // Parse data
                    size_t tempPos = dataBuffer.find("Temp=");
                    size_t humidPos = dataBuffer.find(",Humid=");
                    size_t dustPos = dataBuffer.find(",Dust=");
                    size_t mq7Pos = dataBuffer.find(",MQ7=");
                    size_t lightPos = dataBuffer.find(",Light=");
                    size_t rainPos = dataBuffer.find(",Rain=");

                    string temperature = dataBuffer.substr(tempPos + 5, humidPos - (tempPos + 5));
                    string humidity = dataBuffer.substr(humidPos + 7, dustPos - (humidPos + 7));
                    string dustDensity = dataBuffer.substr(dustPos + 6, mq7Pos - (dustPos + 6));
                    string mq7Value = dataBuffer.substr(mq7Pos + 5, lightPos - (mq7Pos + 5));
                    string lightValue = dataBuffer.substr(lightPos + 7, rainPos - (lightPos + 7));
                    string rainValue = dataBuffer.substr(rainPos + 5);

                    // Insert into SQL Server
                    if (insertDataToSQLServer(temperature, humidity, dustDensity, mq7Value, lightValue, rainValue)) {
                        cout << "Data saved to SQL Server: " << dataBuffer << endl;
                    } else {
                        cerr << "Failed to save data to SQL Server" << endl;
                    }
                } else {
                    cerr << "Data format error: missing one or more expected values." << endl;
                }

                dataBuffer = "";
            }
        }
    }

    CloseHandle(hSerial);
    return 0;
}
