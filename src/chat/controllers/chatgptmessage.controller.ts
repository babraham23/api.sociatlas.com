import { Request, Response } from 'express';
import { OpenAI } from 'openai';

const openai = new OpenAI();

// export const sendChatMessage = async (req: Request, res: Response) => {
//     try {
//         const { content } = req.body;
        
//         const completion = await openai.chat.completions.create({
//             messages: [{ role: 'user', content: content }],
//             model: 'gpt-3.5-turbo',
//         });

//         res.status(201).json({
//             content,
//             completion: completion,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while sending the chat message' });
//     }
// };

export const sendChatMessage = async (req: Request, res: Response) => {
    try {
        // Assuming the body contains a stream of messages
        const { messages } = req.body; // messages should be an array of { role: 'user', content: string } objects

        let responses = [];

        for (const message of messages) {
            const completion = await openai.chat.completions.create({
                messages: [message],
                model: 'gpt-3.5-turbo',
            });
            responses.push(completion);
        }

        res.status(201).json(responses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the stream of messages' });
    }
};
