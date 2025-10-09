-- AlterTable
ALTER TABLE "ServiceVehicleService" ADD COLUMN     "message" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "message" SET DEFAULT 'Olá! Tudo bem? 
Queremos agradecer pela confiança em escolher a Alvorada Estética Automotiva para cuidar do seu veículo. 
Já se passaram 30 dias desde o serviço realizado: [serviço aqui]. Esse é o momento ideal para fazer uma revisão preventiva ou até mesmo potencializar os resultados do serviço com um novo cuidado complementar — mantendo seu carro sempre com aparência de novo e protegido por muito mais tempo. Estamos à disposição para te orientar sobre o que é mais indicado para o seu veículo neste momento. 
Conte com a gente para manter seu carro sempre impecável!

Equipe Alvorada Estética Automotiva';
