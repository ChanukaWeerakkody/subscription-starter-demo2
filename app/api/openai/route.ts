import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { prompt } = req.body;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo', // or 'gpt-4' depending on your subscription
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 150,
                }),
            });

            if (!response.ok) {
                throw new Error(`OpenAI API request failed with status ${response.status}`);
            }

            const data = await response.json();
            res.status(200).json({ result: data.choices[0]?.message.content || 'No response' });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
