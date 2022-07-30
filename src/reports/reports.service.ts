import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { GetEstimateDto } from './dto/get-estimate.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
  ) {}

  create(createReportDto: CreateReportDto, user: User) {
    const report = this.reportsRepository.create(createReportDto);
    report.user = user;
    return this.reportsRepository.save(report);
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.reportsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.findOne(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    Object.assign(report, updateReportDto);
    return this.reportsRepository.save(report);
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }

  createEstimate(getEstimateDto: GetEstimateDto) {
    const { make, model, year, lat, lng, mileage } = getEstimateDto;
    return this.reportsRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
