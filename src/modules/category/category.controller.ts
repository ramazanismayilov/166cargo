import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Auth } from "src/common/decorators/auth.decorator";
import { UserRole } from "src/common/enums/user.enum";
import { AddCategoryDto } from "./dto/addCategory.dto";
import { CategoryService } from "./category.service";
import { UpdateCategoryDto } from "./dto/updateCategory.dto";

@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @Get()
    allCategories() {
        return this.categoryService.allCategories()
    }

    @Post()
    @Auth(UserRole.ADMIN)
    addCategory(@Body() body: AddCategoryDto) {
        return this.categoryService.addCategory(body)
    }

    @Post(':id')
    @Auth(UserRole.ADMIN)
    updateNews(@Param('id') id: number, @Body() body: UpdateCategoryDto) {
        return this.categoryService.updateCategory(id, body)
    }

    @Delete(':id')
    @Auth(UserRole.ADMIN)
    deletecategory(@Param('id') id: number) {
        return this.categoryService.deletecategory(id)
    }
}