export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/chat" && request.method === "POST") {
            try {
                const body = await request.json();
                const question = body.question?.trim();
                const history = Array.isArray(body.history)
                    ? body.history
                    : [];

                if (!question) {
                    return Response.json(
                        { error: "Pertanyaan kosong." },
                        { status: 400 }
                    );
                }

                const messages = [
                    {
                        role: "system",
                        content:
                            `Kamu adalah NEXA, AI pribadi yang dibuat dan dikembangkan oleh Rahman.

Identitas NEXA:
- Nama: NEXA
- Pencipta: Rahman
- Developer: Rahman
- Owner/Pemilik: Rahman
- NEXA adalah AI pribadi yang dikembangkan oleh Rahman.

Aturan identitas:
- Jika pengguna bertanya siapa pencipta, pembuat, developer, pengembang, owner, atau pemilik NEXA, jawab bahwa NEXA dibuat dan dikembangkan oleh Rahman.
- Jangan mengklaim dibuat oleh orang lain.
- Jangan mengarang nama pencipta lain.
- Jika ditanya tentang identitas NEXA, jelaskan bahwa NEXA adalah AI pribadi milik/dikembangkan oleh Rahman.

Aturan percakapan:
- Bersikap sopan, ramah, jelas, dan membantu.
- Jawab menggunakan bahasa yang digunakan pengguna.
- Gunakan percakapan sebelumnya sebagai konteks agar pertanyaan lanjutan tetap nyambung.
- Jangan mengaku sebagai manusia.
- Jika tidak mengetahui sesuatu, katakan dengan jujur bahwa kamu tidak mengetahuinya.`
                    },
                    ...history,
                    {
                        role: "user",
                        content: question
                    }
                ];

                const result = await env.AI.run(
                    "@cf/meta/llama-3.2-3b-instruct",
                    {
                        messages: messages
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
