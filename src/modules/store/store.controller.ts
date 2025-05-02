import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { StoreService } from "./store.service";
import { AddStoreDto } from "./dto/addStore.dto";
import { Auth } from "src/common/decorators/auth.decorator";
import { UserRole } from "src/common/enums/user.enum";
import { UpdateStoreDto } from "./dto/updateStore.dto";

@Controller("stores")
export class StoreController {
    constructor(private storeService: StoreService) { }

    @Get()
    allStores() {
        return this.storeService.allStores()
    }

    @Get(':id')
    getCategoriesByStoreId(@Param('id') id: number) {
        return this.storeService.getCategoriesByStoreId(id)
    }

    @Post()
    @Auth(UserRole.ADMIN)
    addStore(@Body() body: AddStoreDto) {
        return this.storeService.addStore(body)
    }

    @Post(':id')
    @Auth(UserRole.ADMIN)
    updateStore(@Param('id') id: number, @Body() body: UpdateStoreDto) {
        return this.storeService.updateStore(id, body)
    }

    @Delete(':id')
    @Auth(UserRole.ADMIN)
    deleteStore(@Param('id') id: number) {
        return this.storeService.deleteStore(id)
    }
}