export interface ApiResponse<TData> {
  status: string;
  statusCode: number;
  message: string;
  timestamp: Date;
  data: TData;
}
