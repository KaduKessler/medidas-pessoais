import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Max } from 'class-validator';

export class CreateMedidasDto {
  @ApiProperty({ example: 90.5 })
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsPositive()
  @Max(300)
  busto: number;

  @ApiProperty({ example: 85.0 })
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsPositive()
  @Max(300)
  torax: number;

  @ApiProperty({ example: 70.0 })
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsPositive()
  @Max(300)
  cintura: number;

  @ApiProperty({ example: 95.0 })
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsPositive()
  @Max(300)
  quadril: number;

  @ApiProperty({ example: 55.0 })
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsPositive()
  @Max(300)
  coxa: number;

  @ApiProperty({ example: 38.0 })
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsPositive()
  @Max(50)
  calcado: number;
}
