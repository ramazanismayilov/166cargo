import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { GeneralEntity } from "src/entities/General.entity";
import { DataSource, Repository } from "typeorm";
import { AddGeneralDto } from "./dto/addGeneral.dto";
import { ImageEntity } from "src/entities/Image.entity";
import { UpdateGeneralDto } from "./dto/updateGeneral.dto";

@Injectable()
export class GeneralService {
    private generalRepo: Repository<GeneralEntity>
    private imageRepo: Repository<ImageEntity>

    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        this.generalRepo = this.dataSource.getRepository(GeneralEntity)
        this.imageRepo = this.dataSource.getRepository(ImageEntity)
    }

    async allGenerals() {
        const generals = await this.generalRepo.find({ order: { id: 'ASC' }, relations: ['logo'] });
        if (generals.length === 0) throw new NotFoundException('Generals not found');

        return generals;
    }

    async addGeneral(params: AddGeneralDto) {
        const logo = params.logoId
            ? await this.imageRepo.findOne({ where: { id: params.logoId } })
            : null;
        if (params.logoId && !logo) throw new NotFoundException({ message: 'Image not found' });

        const general = this.generalRepo.create({ ...params, logo })
        await this.generalRepo.save(general);
        return { message: "General created successfully", general };
    }

    async updateGeneral(id: number, params: UpdateGeneralDto) {
        const generals = await this.generalRepo.findOne({ where: { id }, relations: ['logo'] });
        if (!generals) throw new NotFoundException({ message: 'Generals not found' });

        const logo = params.logoId
            ? await this.imageRepo.findOne({ where: { id: params.logoId } })
            : generals.logo;
        if (params.logoId && !logo) throw new NotFoundException({ message: 'Image not found' });

        await this.generalRepo.save({
            ...generals,
            ...params,
            logo: logo !== null ? logo : generals.logo,
        });

        const updatedGeneral = await this.generalRepo.findOne({ where: { id }, relations: ['logo'] });
        return { message: "General updated successfully", updatedGeneral };
    }

    async deleteGeneral(generalId: number) {
        let general = await this.generalRepo.findOne({ where: { id: generalId } });
        if (!general) throw new NotFoundException({ message: 'General not found' });

        await this.generalRepo.delete(generalId);
        return { message: "General deleted successfully" };
    }
}