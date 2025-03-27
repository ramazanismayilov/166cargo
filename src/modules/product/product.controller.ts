import { Body, Controller, Get, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { UserRole } from "src/common/enums/user.enum";
import { AddProductCategoryDto } from "./dto/addProductCategory.dto";

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Get()
    allStations() {
        return this.productService.allProducts()
    }

    @Post()
    @Auth(UserRole.ADMIN)
    addProductCategory(@Body() body: AddProductCategoryDto) {
        return this.productService.addProductCategory(body)
    }
}