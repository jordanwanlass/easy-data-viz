import knex, { Knex } from 'knex';
import path from 'path';
import { app } from 'electron';
import { ColumnData, RowData, DataType } from '../types/data-types';

function mapDataTypeToSqliteType(dataType: DataType): string {
  switch (dataType) {
    case DataType.Number:
      return 'REAL';
    case DataType.Boolean:
      return 'INTEGER';
    case DataType.Date:
    case DataType.Text:
    default:
      return 'TEXT';
  }
}

class Database {
  private db: Knex;

  constructor() { /* ... */ }

  async init() { /* ... */ }

  async createTableFromData(tableName: string, columnData: ColumnData[], data: RowData[]) {
    const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '');
    if (!sanitizedTableName) {
      throw new Error('Invalid table name. Please use only letters, numbers, and underscores.');
    }

    await this.db.transaction(async (trx) => {
      const tableExists = await trx.schema.hasTable(sanitizedTableName);
      if (tableExists) {
        throw new Error(`Table '${sanitizedTableName}' already exists.`);
      }

      await trx.schema.createTable(sanitizedTableName, (table) => {
        table.increments('id').primary();

        columnData.forEach(col => {
          const columnName = col.name.replace(/[^a-zA-Z0-9_]/g, '');
          if (!columnName) return;

          const sqliteType = mapDataTypeToSqliteType(col.dataType);

          switch (sqliteType) {
            case 'REAL':
              table.specificType(columnName, 'REAL');
              break;
            case 'INTEGER':
              table.specificType(columnName, 'INTEGER');
              break;
            case 'TEXT':
            default:
              table.specificType(columnName, 'TEXT');
              break;
          }
        });
      });

      if (data.length > 0) {
        await trx(sanitizedTableName).insert(data);
      }
    });
  }
}

export const database = new Database();