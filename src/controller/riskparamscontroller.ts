import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// GET /dashboard/riskparams/get endpoint to read all riskparameters

export const getRiskParams = async (req: Request, res: Response) => {
    try {
        // Fetch all riskparameters from the database
        const riskParams = await prisma.risk_parameters.findMany();
        // Respond with all riskparameters and a 201 status code
        res.status(201).json(riskParams);
    } catch (error) {
        // Handle errors and respond with an error message
        res.status(500).json({ error: error });
    }
}

// POST /dashboard/riskparams/add endpoint to create a new riskparameters

export const addRiskParams = async (req: Request, res: Response) => {
    try {
        // Extract riskparameters details from the request body
        const { symbol, trading_engine_id, trading_account, max_short_position, max_long_position, max_lot_size } = req.body.data;
        
        // Validate request data
        if (!symbol || !trading_engine_id || !trading_account || !max_short_position || !max_long_position || !max_lot_size) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        
        // Create a new riskparameters in the database
        const newParams = await prisma.risk_parameters.create({
            data: {
                symbol,
                trading_engine_id,
                trading_account,
                max_short_position,
                max_long_position,
                max_lot_size,
            },
        });

        // Respond with the created riskparameters and a 201 status code
        res.status(201).json(newParams);
    } catch (error) {
        // Handle errors and respond with an error message
        res.status(500).json({ error: error });
    }
}

// PUT /dashboard/riskparams/update endpoint to update selected riskparameters

export const updateRiskParams = async (req: Request, res: Response) => {
    const updates = req.body; // Get the array of update objects from the request body

    if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ error: 'Invalid input. Please provide an array of update objects.' });
    }

    try {
        // Iterate over the updates array and perform individual updates
        for (const update of updates) {
            const { id, ...fields } = update; // Extract the id and other fields from each update object
            console.log(fields)
            // Check if the record exists
            const existingParams = await prisma.risk_parameters.findUnique({
                where: { id: Number(id) },
            });

            if (!existingParams) {
                return res.status(404).json({ error: `Risk parameters with ID ${id} not found.` });
            }

            // Update the record with the provided fields
            await prisma.risk_parameters.update({
                where: { id: Number(id) },
                data: fields,
            });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Risk parameters updated successfully.' });
    } catch (error) {
        // Handle errors and respond with an error message
        res.status(500).json({ error: error});
    }
};

// POST /dashboard/riskparams/delete endpoint to delete selected riskparameters

export const deleteRiskParams = async (req: Request, res: Response) => {
    const { data } = req.body; // Get the array of IDs from the request body

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ error: 'Invalid input. Please provide an array of IDs.' });
    }

    try {
        // Convert IDs to numbers and check if all exist
        const idNumbers = data.map(data => Number(data));
        const existingParams = await prisma.risk_parameters.findMany({
            where: {
                id: { in: idNumbers },
            },
        });

        // Check if any of the IDs do not exist
        if (existingParams.length !== idNumbers.length) {
            return res.status(404).json({ error: 'Some risk parameters not found.' });
        }

        // Delete the risk parameters from the database
        await prisma.risk_parameters.deleteMany({
            where: {
                id: { in: idNumbers },
            },
        });

        // Respond with a success message
        res.status(204).send(); // No content to send back
    } catch (error) {
        // Handle errors and respond with an error message
        res.status(500).json({ error: error });
    }
}