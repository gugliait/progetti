import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite'
import { Asset } from 'expo-asset';
import React, { useState, useEffect } from 'react';

async function esegui(sql, args, callback) {
    var promise = new Promise(function(resolve, reject) {
        // call resolve if the method succeeds 
        let d = DbManager.db
        if (DbManager.db == null) {
            //console.log('DB is null');
            d = SQLite.openDatabase(DbManager.filename, '1.0'); 
            resolve(d);
        }

        //console.log('promise');
        resolve(d);
      })
      promise.then(function(db) {
        DbManager.db = db;
        //console.log('opendatabase');

        DbManager.db.exec([{ sql: sql, args: args }], false, () =>{ 
            callback()
      });        
    })      
}

export const DbManager = { 
    db: null,
    filename: '',

    pippo: (props) => {
        const [fileName, setfileName] = useState(props.fileName);
        return 'parametro: ' + props.fileName;
    },

    Initialize: async (pr) => {
        const [fileName, setfileName] = useState(pr.fileName);

        DbManager.filename = fileName;   
        
        //Per eliminare il DB 
        // FileSystem.deleteAsync(FileSystem.documentDirectory + 'SQLite/' + fileName);
        // return;
        
        if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
          //console.log('Non esiste');
          await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite', { intermediates: true } );
        }
        
        await FileSystem.downloadAsync(
          Asset.fromModule(require('../../assets/SQLite/PlacesBook.sqlite3')).uri,
          //Asset.fromModule(require(pathFileName)).uri,
          //FileSystem.documentDirectory + 'SQLite/PlacesBook.sqlite3'
          FileSystem.documentDirectory + 'SQLite/' + fileName
        ).then(function() {
            //console.log(fileName);
        })     
    },
    
    // open: () => {
    //     var promise = new Promise(function(resolve, reject) {
    //         // call resolve if the method succeeds
    //         const d = SQLite.openDatabase(DbManager.filename);
    //         console.log('promise');
    //         resolve(d);
    //       })
    //       promise.then(function(db) {
    //         DbManager.db = db;
    //         console.log('opendatabase');
    //       })        
    // },

    /*
        sql = query
        params = parametri della query
        callback(result) = function di callback con risultato della query
    */
    executeQuery: (sql, args, callback) => {        
        var promise = new Promise(function(resolve, reject) {
            // call resolve if the method succeeds 
            let d = DbManager.db
            if (DbManager.db == null) {
                //console.log('DB is null');
                d = SQLite.openDatabase(DbManager.filename, '1.0'); 
                resolve(d);
            }

            //console.log('promise');
            resolve(d);
          })
          promise.then(function(db) {
            DbManager.db = db;
            //console.log('opendatabase');
            DbManager.db.transaction(
                tx => {               
                    tx.executeSql(
                        sql,
                        args,
                        (tx,result)  => {                           
                            console.log('righe calcolate: ' + result.rows.length);
                            callback(result);
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
        })      
    },

    executeInsert: (sql, args, callback) => {    
        esegui(sql, args, callback);    
   },   
}