export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // =========================
        // NEXA CHAT
        // =========================
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

        // =========================
        // NEXA VISION
        // =========================
        if (url.pathname === "/api/vision" && request.method === "POST") {
            try {
                const body = await request.json();

                const question =
                    body.question?.trim() ||
                    "Jelaskan gambar ini dengan jelas.";

                const image = body.image;

                if (!image) {
                    return Response.json(
                        { error: "Gambar tidak ditemukan." },
                        { status: 400 }
                    );
                }

                const messages = [
                    {
                        role: "system",
                        content:
                            `Kamu adalah NEXA Vision, bagian visual dari NEXA.

NEXA dibuat dan dikembangkan oleh Rahman.

Tugasmu adalah memahami gambar yang diberikan pengguna dan menjawab pertanyaan tentang gambar tersebut.

Aturan:
- Jawab dengan jelas dan jujur.
- Gunakan bahasa pengguna.
- Jangan mengarang detail yang tidak terlihat.
- Jika sesuatu tidak dapat dipastikan dari gambar, katakan bahwa kamu tidak dapat memastikannya.
- Jangan mengaku sebagai manusia.`
                    },
                    {
                        role: "user",
                        content: question
                    }
                ];

                const result = await env.AI.run(
                    "@cf/meta/llama-3.2-11b-vision-instruct",
                    {
                        messages: messages,
                        image: image
                    }
                );

                return Response.json({
                    answer: result.response
                });
            } catch (error) {
                return Response.json(
                    { error: "NEXA Vision sedang mengalami gangguan." },
                    { status: 500 }
                );
            }
        }

        return env.ASSETS.fetch(request);
    }
};
