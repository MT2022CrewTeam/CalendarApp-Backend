require("dotenv").config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}
  
  private getValue(key: string): string {
    const value = this.env[key];
    if(!value) {
      throw new Error (`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k));
    return this;
  }

  public getMongodbConnectionConfig() {
    return {
      databaseUrl: this.getValue('MONGODB_CONNECTION'),
      databaseName: this.getValue('MONGODB_DATABASE'),
      appPort: this.getValue('APP_PORT'),
    }
  }

  public getJWTConfig(){
    return {
      jwtSecret: this.getValue('JWT_PASSWORD')
    }
  }
  
}

const configService = new ConfigService(process.env).ensureValues([
  'MONGODB_CONNECTION',
  'MONGODB_DATABASE',
  'MONGODB_USER',
  'MONGODB_PASSWORD',
  'JWT_PASSWORD'
]);

export {configService};
