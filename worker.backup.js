export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/chat" && request.method === "POST") {
            try {
                const body = await request.json();
                const question = body.question?.trim();

                if (!question) {
                    return Response.json(
                        { error: "Pertanyaan kosong." },
                        { status: 400 }
                    );
                }

                const result = await env.AI.run(
                    "@cf/meta/llama-3.2-3b-instruct",
                    {
                        messages: [
                            {
                                role: "system",
                                content:
                                    "Kamu adalah NEXA, AI Assistant yang sopan, ramah, jelas, dan membantu. Jawab dalam bahasa yang digunakan pengguna."
                            },
                            {
                                role: "user",
                                content: question
                            }
                        ]
                    }
                );

                return Response.json({
                    answer: result.response
                });
            } catch (error) {
                return Response.json(
                    { error: "NEXA sedang mengalami gangguan." },
                    { status: 500 }
                );
            }
        }

        return env.ASSETS.fetch(request);
    }
};
