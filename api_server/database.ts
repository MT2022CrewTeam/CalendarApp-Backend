import mongoose, { Mongoose } from "mongoose";
import { configService } from "./config/config";


export class MongooseConnection {
  public mongoose = new Mongoose();

  constructor (databaseUrl: string, connectionOptions: { [k: string]: string }) {
    this.mongoose.connect(databaseUrl, connectionOptions);
    this.mongoose.connection.on('connecting', function(){
      console.log('trying to connect to mongodb Atlas');
    });
    this.mongoose.connection.on('connected', function() {
      console.log('Mongoose connected to mongodb Atlas' );
    });
    this.mongoose.connection.on('error', function(err: Error) {
      console.log('Mongoose connection error: ' + err);
    });
    this.mongoose.connection.on('disconnected', function() {
      console.log('Mongoose disconnected');
    });
    // process.once('SIGUSR2', function() {
    //   this._controlledSuthdown('nodemon restart', function() {
    //     process.kill(process.pid, 'SISGUR2');
    //   });
    // })
    // process.on('SIGINT', function() {
    //   this._controlledSuthdown('app termination', function() {
    //       process.exit(0);
    //   });
    // });
  }
  
  public _controlledSuthdown = function(msg: string, callback: Function) {
    mongoose.connection.close(function () {
      console.log(`Mongoose disconnected through ${msg}` );
      callback();
    })
  }
}













export {mongoose}