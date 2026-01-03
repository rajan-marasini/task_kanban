import { db } from ".."; // your drizzle db instance
import { columns } from "../schema";

async function seedColumns() {
    console.log("🌱 Seeding columns...");

    await db.insert(columns).values([
        { name: "To Do", position: 0 },
        { name: "In Progress", position: 1 },
        { name: "Done", position: 2 },
    ]);

    console.log("✅ Columns seeded successfully");
    process.exit(0);
}

seedColumns().catch((err) => {
    console.error("❌ Seeding failed", err);
    process.exit(1);
});
