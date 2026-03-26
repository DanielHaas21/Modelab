# Middleware / API

## Contents

- [Middleware / API](#middleware--api)
  - [Contents](#contents)
  - [API](#api)
  - [Structure](#structure)
  - [Service](#service)
  - [Defining an endpoint](#defining-an-endpoint)
    - [Endpoint interfaces](#endpoint-interfaces)
    - [Endpoint query](#endpoint-query)

## API

To learn more about the structure of the api see: <br>
[Modelab-api](https://github.com/DanielHaas21/Modelab-api)

## Structure

```
├───middleware 
│   ├───actions - Exposed actions used by the App
│   ├───config - Route and API Path configuration
│   ├───services - Individual route services
│   ├───types - Types
│   └───utils - Data mappers, loaders and other utilities
```

## Service

Each route has it's service which provides the request actions.
The service extends from `AxiosService` which provides `GET` and `POST` methods with bearer token authorization. 

## Defining an endpoint

To define an endpoint in a service you must:
1. Define endpoint interfaces
3. Create a new query in the service
   
### Endpoint interfaces

The endpoint interfaces are defined in `middleware/types/services/someService.ts` and are separated with a comment specifing the endpoint.

| Interface   | Purpose                                                       |
| ----------- | ------------------------------------------------------------- |
| Query       | TypeScript friendly arguments                                 |
| Data        | Parsed, ready to stringify, data which are sent to the server |
| Response    | TypeScript friendly response data                             |
| RawResponse | Raw response parsed from JSON                                 |

Example:
```ts
// Search Logs

export interface AdminSearchLogsQuery {
  pagination: PaginationQuery;
  queries: LogQueries;
}

export interface AdminSearchLogsData {
  page: number;
  count: number;
  statusQuery?: LogStatus[];
  dateStartQuery?: string;
  dateEndQuery?: string;
}

export interface AdminSearchLogsResponse extends BaseResponse {
  logs: LogModel[];
  info: PaginationInfo;
}

export interface RawAdminSearchLogsResponse extends Omit<AdminSearchLogsResponse, 'logs'> {
  logs: LogRaw[];
}
```

### Endpoint query

The last step it to create a new query in the service. The service is in `middleware/services/variants/SomeService.ts`.

If the endpoint needs to parse a rew response a utility mapper function should be used.

Example:
```ts
class AdminService extends AxiosService {
  // ...

  public async searchLogs(query: AdminSearchLogsQuery): Promise<AdminSearchLogsResponse> {
    const data: AdminSearchLogsData = {
      page: query.pagination.page,
      count: query.pagination.count,
      statusQuery: query.queries.statusQuery,
      dateStartQuery: query.queries.dateStartQuery?.toISOString(),
      dateEndQuery: query.queries.dateEndQuery?.toISOString(),
    };
    const raw = await this.POST<RawAdminSearchLogsResponse>(`log/search`, data);

    return {
      ...raw,
      logs: raw.logs.map(mapLogRawToModel)
    };
  }
}
```