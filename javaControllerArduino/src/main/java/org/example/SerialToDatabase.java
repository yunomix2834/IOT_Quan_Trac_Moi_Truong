import java.io.*;
import java.sql.*;
import java.util.regex.*;
import com.fazecast.jSerialComm.SerialPort;

public class SerialToDatabase {
    private static final String CONNECTION_URL = "jdbc:sqlserver://SQL8020.site4now.net;databaseName=db_aac032_yunomix2834;user=db_aac032_yunomix2834_admin;password=dinhanst2832004;";
    private static StringBuilder dataBuffer = new StringBuilder();

    public static void main(String[] args) {
        SerialPort comPort = SerialPort.getCommPort("COM3");
        comPort.setComPortParameters(9600, 8, SerialPort.ONE_STOP_BIT, SerialPort.NO_PARITY);
        comPort.setComPortTimeouts(SerialPort.TIMEOUT_READ_SEMI_BLOCKING, 0, 0);

        if (!comPort.openPort()) {
            System.out.println("Failed to open COM port.");
            return;
        }

        try (InputStream in = comPort.getInputStream()) {
            byte[] buffer = new byte[256];
            while (true) {
                int numRead = in.read(buffer);
                if (numRead > 0) {
                    String receivedData = new String(buffer, 0, numRead);
                    dataBuffer.append(receivedData);
                    System.out.println("Received data: " + receivedData);

                    // Kiểm tra và xử lý dữ liệu đầy đủ (phân biệt bằng dấu newline '\n')
                    int newlineIndex;
                    while ((newlineIndex = dataBuffer.indexOf("\n")) != -1) {
                        String completeData = dataBuffer.substring(0, newlineIndex).trim();
                        dataBuffer.delete(0, newlineIndex + 1);

                        processReceivedData(completeData);
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            comPort.closePort();
        }
    }

    private static void processReceivedData(String data) {
        Pattern pattern = Pattern.compile("Temp=(.*?),Humid=(.*?),Dust=(.*?),MQ7=(.*?),Light=(.*?),Rain=(.*)");
        Matcher matcher = pattern.matcher(data);

        if (matcher.find()) {
            String temperature = matcher.group(1);
            String humidity = matcher.group(2);
            String dustDensity = matcher.group(3);
            String mq7Value = matcher.group(4);
            String lightValue = matcher.group(5);
            String rainValue = matcher.group(6);

            if (insertDataToSQLServer(temperature, humidity, dustDensity, mq7Value, lightValue, rainValue)) {
                System.out.println("Data saved to SQL Server: " + data);
            } else {
                System.err.println("Failed to save data to SQL Server");
            }
        } else {
            System.err.println("Data format error: missing one or more expected values.");
        }
    }

    private static boolean insertDataToSQLServer(String temperature, String humidity, String dustDensity, String mq7Value, String lightValue, String rainValue) {
        try (Connection conn = DriverManager.getConnection(CONNECTION_URL);
             PreparedStatement stmt = conn.prepareStatement("INSERT INTO SensorData (Temperature, Humidity, DustDensity, MQ7, Light, Rain) VALUES (?, ?, ?, ?, ?, ?)")) {

            stmt.setString(1, temperature);
            stmt.setString(2, humidity);
            stmt.setString(3, dustDensity);
            stmt.setString(4, mq7Value);
            stmt.setString(5, lightValue);
            stmt.setString(6, rainValue);

            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
