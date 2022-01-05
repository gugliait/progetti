import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite'
import { Asset } from 'expo-asset';
import React, { useState, useEffect } from 'react';

 export const prova = { 
    db: null,
    filename: '',

    pippo: (props) => {
        const [fileName, setfileName] = useState(props.fileName);
        return 'parametro: ' + props.fileName;
    },

    Initialize: async (props) => {
        const [pathFileName, setPathFileName] = useState(props.pathFileName);
        const [fileName, setfileName] = useState(props.fileName);

        prova.filename = fileName;
            
        if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
          console.log('Non esiste');
          await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
        }
        console.log(fileName);
        await FileSystem.downloadAsync(
          Asset.fromModule(require('../../assets/SQLite/PlacesBook.sqlite3')).uri,
          //Asset.fromModule(require(pathFileName)).uri,
          //FileSystem.documentDirectory + 'SQLite/PlacesBook.sqlite3'
          FileSystem.documentDirectory + 'SQLite/' + fileName
        ).then(function() {
          prova.db = SQLite.openDatabase(fileName, '1', '', 20000, () => {
            console.log("Database OPENED");
          })
        })
        //return db;        
    },
    
    open: () => {
        prova.db = SQLite.openDatabase(prova.filename);
        console.log(prova.db);
    },

    select: () => {
        prova.db.transaction(
            tx => {
            console.log("This is printed");
            tx.executeSql(
                'select * from circumstances',
                [],
                (tx,result)  => {
                console.log('query eseguita: '+ result.rows.length);
                let res = result.rows.item(0);
                console.log('id = ' + res.crcDescription);
                },
                (tx, error) => {
                console.log("Could not execute query: " + error);
                }
            );
            },
            error => {
            console.log("Transaction error: " + error);
            },
            () => {
            console.log("Transaction done");
            }
        );        
    },

}
