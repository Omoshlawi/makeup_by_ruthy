import { NextFunction, Request, Response } from "express";
import { PaymentModel } from "../models";

export const mpesaCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(
      "-------------------Ip address",
      req.ip || req.socket.remoteAddress || req.connection.remoteAddress
    );
    const {
      Body: {
        stkCallback: {
          MerchantRequestID,
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
          CallbackMetadata: { Item },
        },
      },
    } = req.body;
    const data = (Item as any[]).reduce((prev, curr) => {
      if (curr.Name === "Amount") return { ...prev, amount: curr.Value };
      else if (curr.Name === "MpesaReceiptNumber")
        return { ...prev, mpesareceiptNumber: curr.Value };
      else if (curr.Name === "TransactionDate")
        return { ...prev, transactionDate: `${curr.Value}` };
      else if (curr.Name === "PhoneNumber")
        return { ...prev, phoneNumber: `${curr.Value}` };
      else return prev;
    }, {});
    const payload = {
      merchantRequestId: MerchantRequestID,
      checkoutRequestId: CheckoutRequestID,
      resultCode: String(ResultCode),
      resultDescription: ResultDesc,
      ...data,
    };

    let payment = await PaymentModel.update({
      where: {
        merchantRequestId: payload.merchantRequestId,
        checkoutRequestId: payload.checkoutRequestId,
      },
      data: {
        complete: true,
        ...payload,
      },
    });

    return res.json(payment);
  } catch (error) {
    next(error);
  }
};
