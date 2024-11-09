import { Injectable, NotFoundException } from '@nestjs/common';
import { Consumo } from './consumo_agua.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ConsumoAguaService {

    //consumos: Consumo[];

    constructor( @InjectModel('Consumo') private readonly consumoModel: Model<Consumo> ){}

    // CRUD
    //CREATE
    async createConsumo(consumo:Consumo){
        const consumoModel = new this.consumoModel(
            {
                userId: consumo.userId,
                consumoAgua: consumo.consumoAgua,
                dataLeitura: consumo.dataLeitura
            }
        );
        const result = await consumoModel.save();

        const alerta = await this.verificarAlertaConsumo(consumo.userId);

        return {
            id: result.id as string,
            alerta
        }
    }

    // //READ
    // async readConsumos(){
    //     const consumos = await this.consumoModel.find().exec();
    //     return consumos;
    // }

    //READ
    async getConsumoHistorico(userId: number, dataInicio: Date, dataFim: Date){
        const historico = await this.consumoModel.find({
            userId: userId,
            dataLeitura: {$gte: dataInicio, $lte:dataFim}
        }).exec();

        if(!historico || historico.length ===0) {
            throw new NotFoundException("Nenhum registro de consumo encontrado no período");
        }

        return historico;
    }

    //UPDATE
    async updateConsumo(consumo:Consumo){
        const updatedConsumo = await this.consumoModel.findOne({userId: consumo.userId});
        if (!updatedConsumo){
            throw new NotFoundException("Usuário não encontrado.");
        }
        if(consumo.userId){
            updatedConsumo.userId = consumo.userId;
        }
        if(consumo.consumoAgua){
            updatedConsumo.consumoAgua = consumo.consumoAgua;
        }
        if(consumo.dataLeitura){
            updatedConsumo.dataLeitura = consumo.dataLeitura;
        }
        updatedConsumo.save();
        
        return {
            userId: updatedConsumo.userId,
            consumoAgua: updatedConsumo.consumoAgua,
            dataLeitura: updatedConsumo.dataLeitura
        }
    }

    //DELETE

    async deleteConsumo(userId: number){
        const result = await this.consumoModel.deleteOne({userId: userId}).exec();
        if (result.deletedCount === 0 ){
            throw new NotFoundException("Usuário não encontrado.");
        }
    }

    //ALERTA CONSUMO
    async verificarAlertaConsumo(userId: number){
        const consumos = await this.consumoModel
            .find({userId:userId})
            .sort({dataLeitura: -1})
            .limit(2)
            .exec();

        if(consumos.length < 2){
            return {
                alerta:false,
                mensagem: "Dados insuficientes para gerar alerta de consumo elevado. São necessários pelo menos 2 meses cadastrados."
            }
            
        }

        const consumoMesAtual = consumos[0].consumoAgua;
        const consumoMesAnterior = consumos[1].consumoAgua;

        if(consumoMesAtual > consumoMesAnterior){
            return {
                alerta:true,
                mensagem: "Consumo elevado! O consumo deste mês ultrapassou o mês anterior!"
            };
        } else {
            return{
                alerta:false,
                mensagem: "Consumo dentro dos limites do mês anterior."
            };
        }
    }

    
}
