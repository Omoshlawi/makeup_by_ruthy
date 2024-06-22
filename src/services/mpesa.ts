import { APIException } from "@/shared/exceprions";
import logger from "@/shared/logger";
import { configuration } from "@/utils";
import { Enrollment } from "@prisma/client";
import { Mpesa } from "daraja.js";

export const triggerStkPush = async (
  nomalizedPhoneNumber: string,
  amount: number,
  description: string
) => {
  try {
    const calbackUrl = `${configuration.backend_url}/mpesa/callback`;

    // Instantiate Mpesa
    const app = new Mpesa(
      {
        debug: configuration.mpesa.debug,
        consumerKey: configuration.mpesa.consumer_key,
        consumerSecret: configuration.mpesa.consumer_secrete,
        organizationShortCode: configuration.mpesa.short_code,
        initiatorPassword: configuration.mpesa.initiator_password,
      },
      configuration.mpesa.env
    );

    // Trigger stk push
    const response = await app
      .stkPush()
      .phoneNumber(Number(`254${nomalizedPhoneNumber}`))
      .amount(amount)
      .accountNumber(configuration.mpesa.account_ref)
      .lipaNaMpesaPassKey(configuration.mpesa.pass_key)
      .paymentType("CustomerBuyGoodsOnline")
      .callbackURL(calbackUrl)
      .description(description)
      .send();
    return response;
  } catch (e: any) {
    logger.error(`Error initating stk push${e.message}`);
    throw new APIException(500, { detail: e.message });
  }
};

export const makeEnrollmentPayment = async (enrollment: Enrollment) => {};
