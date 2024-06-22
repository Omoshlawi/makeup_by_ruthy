import config from "config";
import path from "path";
export const BASE_DIR = process.cwd();
export const MEDIA_ROOT = path.join(BASE_DIR, "media");
export const MEDIA_URL = "media";
export const PROFILE_URL = "uploads";
export const PHONE_NUMBER_REGEX = /^(\+?254|0)((7|1)\d{8})$/;

export const configuration = {
  version: require("./../../package.json").version,
  name: require("./../../package.json").name,
  db: config.get("db") as string | undefined | null,
  port: config.get("port") as string | undefined | null,
  jwt: config.get("jwt") as string | undefined | null,
  backend_url: config.get("backend_url") as string,
  mpesa: {
    debug: config.get("mpesa_debug") === "true",
    env: config.get("mpesa_env") as string,
    consumer_secrete: config.get("mpesa_consumer_secrete") as string,
    consumer_key: config.get("mpesa_consumer_key") as string,
    short_code: Number(config.get("mpesa_short_code")),
    initiator_password: config.get("mpesa_initiator_password") as string,
    pass_key: config.get("mpesa_pass_key") as string,
    account_ref: config.get("mpesa_account_ref") as string,
  },
};
export { isValidURL, parseMessage } from "@/utils/helpers";
