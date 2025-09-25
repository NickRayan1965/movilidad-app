import fs from "fs";
import supabase from "./supabase.js";
import { config } from 'dotenv';
config();
const bucketName = process.env.SUPABASE_BUCKET;
export async function uploadDb() {
  const fileBuffer = fs.readFileSync("app.db");
  const { data, error } = await supabase.storage
    .from(bucketName) // nombre del bucket
    .upload("app.db", fileBuffer, {
      cacheControl: "0",
      upsert: true,
      contentType: "application/octet-stream"
    });
  if (error) console.error("Error subiendo:", error);
  else console.log("Subido:", data);
}
export async function downloadDb(){
  const { data, error } = await supabase.storage
    .from(bucketName)
    .download("app.db");
    if (error) return console.error("Error bajando:", error);

  const fileBuffer = Buffer.from(await data.arrayBuffer());
  fs.writeFileSync("app.db", fileBuffer);
  console.log("DB restaurada localmente");
}
let taskId = null;
const TIMES = {
  TEN_MINUTES: 600000,
  THIRTY_SECONDS: 30000,
  ONE_MINUTE: 60000,
};
export function cleanAndProgramDbBackup() {
  taskId && clearTimeout(taskId);
  taskId = setTimeout(() => {
    uploadDb();
  }, TIMES.THIRTY_SECONDS);
}