// test-stream.js
import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';
dotenv.config();

const client = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

(async () => {
  try {
    const userId = "testuser123";
    await client.upsertUser({
      id: userId,
      name: "Test User",
      image: "https://getstream.io/random_png/?id=testuser123&name=Test"
    });

    const token = client.createToken(userId);
    console.log("✅ Stream user created successfully.");
    console.log("🪪 Token:", token);
  } catch (err) {
    console.error("❌ Failed to upsert user:", err);
  }
})();
