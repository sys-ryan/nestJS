import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('reports')
export class ReportsController {

  @Post()
  createReport(@Body() body: CreateReportDto) {
    
  }


  @Get()


}
