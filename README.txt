Name        LAI YE QI
Class       DIT/FT/1B/05
Group       ??
Admn        P2222189


# Setting up BED Project

1. With MySQL Workbench open and signed in to your database, create a new schema with the name `bed_dvd_db`.
2. Open the `sakilqa_bed.sql` file in MySQL and ran the script.
3. Create a new MySQL user for the server to access, through the command

    CREATE USER 'bed_dvd_root'@'localhost';
    GRANT ALL PRIVILEGES ON bed_dvd_db.* To 'bed_dvd_root'@'localhost';
    ALTER USER 'bed_dvd_root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'pa$$woRD123';

4. Edit the database name, username and password in `model/databaseConfig.js` to "bed_dvd_db", "bed_dvd_root" and "pa$$woRD123" respectively.
5. Run `node server.js` to start the server.
