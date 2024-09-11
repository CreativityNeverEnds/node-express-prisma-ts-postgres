-- CreateTable
CREATE TABLE "risk_parameters" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "trading_engine_id" TEXT NOT NULL,
    "trading_account" TEXT NOT NULL,
    "max_short_position" TEXT NOT NULL,
    "max_long_position" TEXT NOT NULL,
    "max_lot_size" TEXT NOT NULL,

    CONSTRAINT "risk_parameters_pkey" PRIMARY KEY ("id")
);
