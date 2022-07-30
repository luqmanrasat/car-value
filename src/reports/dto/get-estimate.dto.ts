import { OmitType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';

export class GetEstimateDto extends OmitType(CreateReportDto, [
  'price',
] as const) {}
