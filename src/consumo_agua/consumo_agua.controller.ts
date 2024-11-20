import { Body, Controller, Get, Post, Patch, Param, Delete, Query } from '@nestjs/common';
import { ConsumoAguaService } from './consumo_agua.service';
import { Consumo } from './consumo_agua.model';

@Controller('consumo-agua')
export class ConsumoAguaController {
    constructor(private readonly consumoAguaService:ConsumoAguaService){}

    // @Get()
    // readAllConsumo():Promise<any>{
    //     return this.consumoAguaService.readConsumos();
    // }

    @Post('historico')
    async getConsumoHistorico(
        @Body('userId') userId:number,
        @Body('dataInicio') dataInicio:Date,
        @Body('dataFim') dataFim:Date
    ){
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        return await this.consumoAguaService.getConsumoHistorico(userId, inicio, fim);
    }

    @Post()
    async createConsumo(@Body() consumo:Consumo): Promise<any>{
        var resposta = await this.consumoAguaService.createConsumo(consumo);
        return{id:resposta};
    }

    @Patch()
    async updateConsumo( @Body() consumo:Consumo){
        await this.consumoAguaService.updateConsumo(consumo);
        return null;
    }

    @Delete(':userId')
    async deleteConsumo(@Param('userId') userId:number){
        await this.consumoAguaService.deleteConsumo(userId);
        return null;
    }


}
