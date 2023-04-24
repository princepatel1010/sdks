import { BigNumber } from "ethers";

import { DutchLimitOrder } from "../order/DutchLimitOrder";
import { encodeExclusiveFillerData, ValidationType } from "../order/validation";

import { DutchLimitOrderBuilder } from "./DutchLimitOrderBuilder";

describe("DutchLimitOrderBuilder", () => {
  let builder: DutchLimitOrderBuilder;

  beforeEach(() => {
    builder = new DutchLimitOrderBuilder(1);
  });

  it("Builds a valid order", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const order = builder
      .deadline(deadline)
      .endTime(deadline)
      .startTime(deadline - 100)
      .offerer("0x0000000000000000000000000000000000000001")
      .nonce(BigNumber.from(100))
      .input({
        token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        startAmount: BigNumber.from("1000000"),
        endAmount: BigNumber.from("1000000"),
      })
      .output({
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        startAmount: BigNumber.from("1000000000000000000"),
        endAmount: BigNumber.from("900000000000000000"),
        recipient: "0x0000000000000000000000000000000000000000",
      })
      .build();

    expect(order.info.startTime).toEqual(deadline - 100);
    expect(order.info.outputs.length).toEqual(1);
  });

  it("Builds a valid order with validation", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const fillerAddress = "0x1111111111111111111111111111111111111111";
    const validationContract = "0x2222222222222222222222222222222222222222";
    const timestamp = Math.floor(Date.now() / 1000) + 100;
    const validationInfo = encodeExclusiveFillerData(
      fillerAddress,
      timestamp,
      1,
      validationContract
    );
    const order = builder
      .deadline(deadline)
      .endTime(deadline)
      .startTime(deadline - 100)
      .offerer("0x0000000000000000000000000000000000000001")
      .nonce(BigNumber.from(100))
      .input({
        token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        startAmount: BigNumber.from("1000000"),
        endAmount: BigNumber.from("1000000"),
      })
      .validation(validationInfo)
      .output({
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        startAmount: BigNumber.from("1000000000000000000"),
        endAmount: BigNumber.from("900000000000000000"),
        recipient: "0x0000000000000000000000000000000000000000",
      })
      .build();

    expect(order.info.startTime).toEqual(deadline - 100);
    expect(order.info.outputs.length).toEqual(1);
    expect(order.validation).toEqual({
      type: ValidationType.ExclusiveFiller,
      data: {
        filler: fillerAddress,
        lastExclusiveTimestamp: timestamp,
      },
    });
  });

  it("Regenerates builder from order", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const fillerAddress = "0x1111111111111111111111111111111111111111";
    const validationContract = "0x2222222222222222222222222222222222222222";
    const timestamp = Math.floor(Date.now() / 1000) + 100;
    const validationInfo = encodeExclusiveFillerData(
      fillerAddress,
      timestamp,
      1,
      validationContract
    );
    const order = builder
      .deadline(deadline)
      .endTime(deadline)
      .startTime(deadline - 100)
      .offerer("0x0000000000000000000000000000000000000001")
      .nonce(BigNumber.from(100))
      .input({
        token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        startAmount: BigNumber.from("1000000"),
        endAmount: BigNumber.from("1000000"),
      })
      .validation(validationInfo)
      .output({
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        startAmount: BigNumber.from("1000000000000000000"),
        endAmount: BigNumber.from("900000000000000000"),
        recipient: "0x0000000000000000000000000000000000000000",
      })
      .build();

    const regenerated = DutchLimitOrderBuilder.fromOrder(order).build();
    expect(regenerated.toJSON()).toMatchObject(order.toJSON());
  });

  it("Regenerates builder from order json", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const fillerAddress = "0x1111111111111111111111111111111111111111";
    const validationContract = "0x2222222222222222222222222222222222222222";
    const timestamp = Math.floor(Date.now() / 1000) + 100;
    const validationInfo = encodeExclusiveFillerData(
      fillerAddress,
      timestamp,
      1,
      validationContract
    );
    const order = builder
      .deadline(deadline)
      .endTime(deadline)
      .startTime(deadline - 100)
      .offerer("0x0000000000000000000000000000000000000001")
      .nonce(BigNumber.from(100))
      .input({
        token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        startAmount: BigNumber.from("1000000"),
        endAmount: BigNumber.from("1000000"),
      })
      .validation(validationInfo)
      .output({
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        startAmount: BigNumber.from("1000000000000000000"),
        endAmount: BigNumber.from("900000000000000000"),
        recipient: "0x0000000000000000000000000000000000000000",
      })
      .build();

    const json = order.toJSON();
    const regenerated = DutchLimitOrderBuilder.fromOrder(
      DutchLimitOrder.fromJSON(json, 1)
    ).build();
    expect(regenerated.toJSON()).toMatchObject(order.toJSON());
  });

  it("Regenerates builder allows modification", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const fillerAddress = "0x1111111111111111111111111111111111111111";
    const validationContract = "0x2222222222222222222222222222222222222222";
    const timestamp = Math.floor(Date.now() / 1000) + 100;
    const validationInfo = encodeExclusiveFillerData(
      fillerAddress,
      timestamp,
      1,
      validationContract
    );
    const order = builder
      .deadline(deadline)
      .endTime(deadline)
      .startTime(deadline - 100)
      .offerer("0x0000000000000000000000000000000000000001")
      .nonce(BigNumber.from(100))
      .input({
        token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        startAmount: BigNumber.from("1000000"),
        endAmount: BigNumber.from("1000000"),
      })
      .validation(validationInfo)
      .output({
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        startAmount: BigNumber.from("1000000000000000000"),
        endAmount: BigNumber.from("900000000000000000"),
        recipient: "0x0000000000000000000000000000000000000000",
      })
      .build();

    const regenerated = DutchLimitOrderBuilder.fromOrder(order)
      .startTime(order.info.startTime + 1)
      .build();
    expect(regenerated.info.startTime).toEqual(order.info.startTime + 1);
  });

  it("Builds a valid order with multiple outputs", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const order = builder
      .deadline(deadline)
      .endTime(deadline)
      .startTime(deadline - 100)
      .offerer("0x0000000000000000000000000000000000000000")
      .nonce(BigNumber.from(100))
      .input({
        token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        startAmount: BigNumber.from("1000000"),
        endAmount: BigNumber.from("1000000"),
      })
      .output({
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        startAmount: BigNumber.from("1000000000000000000"),
        endAmount: BigNumber.from("900000000000000000"),
        recipient: "0x0000000000000000000000000000000000000000",
      })
      .output({
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        startAmount: BigNumber.from("1000000000000000000"),
        endAmount: BigNumber.from("900000000000000000"),
        recipient: "0x0000000000000000000000000000000000000001",
      })
      .build();

    expect(order.info.startTime).toEqual(deadline - 100);
    expect(order.info.outputs.length).toEqual(2);
  });

  it("startAmount <= endAmount", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    expect(() =>
      builder
        .deadline(deadline)
        .endTime(deadline)
        .startTime(deadline - 100)
        .offerer("0x0000000000000000000000000000000000000001")
        .nonce(BigNumber.from(100))
        .input({
          token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          startAmount: BigNumber.from("1000000"),
          endAmount: BigNumber.from("1000000"),
        })
        .output({
          token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          startAmount: BigNumber.from("100"),
          endAmount: BigNumber.from("110"),
          recipient: "0x0000000000000000000000000000000000000000",
        })
        .build()
    ).toThrow("startAmount must be greater than endAmount: 100");
  });

  it("Deadline already passed", () => {
    const expiredDeadline = 1234;
    expect(() => builder.deadline(expiredDeadline)).not.toThrow();
    expect(() =>
      builder
        .deadline(expiredDeadline)
        .endTime(expiredDeadline)
        .startTime(expiredDeadline - 100)
        .offerer("0x0000000000000000000000000000000000000001")
        .nonce(BigNumber.from(100))
        .input({
          token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          startAmount: BigNumber.from("1000000"),
          endAmount: BigNumber.from("1000000"),
        })
        .output({
          token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          startAmount: BigNumber.from("100"),
          endAmount: BigNumber.from("90"),
          recipient: "0x0000000000000000000000000000000000000000",
        })
        .build()
    ).toThrow(`Deadline must be in the future: ${expiredDeadline}`);
  });

  it("Start time must be before deadline", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const order = builder
      .deadline(deadline)
      .startTime(deadline + 1)
      .endTime(deadline + 1)
      .offerer("0x0000000000000000000000000000000000000000")
      .nonce(BigNumber.from(100))
      .input({
        token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        startAmount: BigNumber.from("1000000"),
        endAmount: BigNumber.from("1200000"),
      })
      .output({
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        startAmount: BigNumber.from("1000000000000000000"),
        endAmount: BigNumber.from("900000000000000000"),
        recipient: "0x0000000000000000000000000000000000000000",
      })
      .output({
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        startAmount: BigNumber.from("1000000000000000000"),
        endAmount: BigNumber.from("900000000000000000"),
        recipient: "0x0000000000000000000000000000000000000001",
      });

    expect(() => order.build()).toThrow(
      `startTime must be before or same as deadline: ${deadline + 1}`
    );
  });

  it("Does not throw before an order has not been finished building", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    expect(() =>
      builder.deadline(deadline).startTime(deadline + 1)
    ).not.toThrowError();
  });

  it("Unknown chainId", () => {
    const chainId = 99999999;
    expect(() => new DutchLimitOrderBuilder(chainId)).toThrow(
      `Missing configuration for reactor: ${chainId}`
    );
  });

  it("Must set offerer", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    expect(() =>
      builder
        .deadline(deadline)
        .endTime(deadline)
        .startTime(deadline - 100)
        .nonce(BigNumber.from(100))
        .input({
          token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          startAmount: BigNumber.from("1000000"),
          endAmount: BigNumber.from("1000000"),
        })
        .output({
          token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          startAmount: BigNumber.from("1000000000000000000"),
          endAmount: BigNumber.from("900000000000000000"),
          recipient: "0x0000000000000000000000000000000000000000",
        })
        .build()
    ).toThrow("Invariant failed: offerer not set");
  });

  it("Must set deadline or endTime", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    expect(() =>
      builder
        .startTime(deadline - 100)
        .offerer("0x0000000000000000000000000000000000000000")
        .nonce(BigNumber.from(100))
        .input({
          token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          startAmount: BigNumber.from("1000000"),
          endAmount: BigNumber.from("1000000"),
        })
        .output({
          token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          startAmount: BigNumber.from("1000000000000000000"),
          endAmount: BigNumber.from("900000000000000000"),
          recipient: "0x0000000000000000000000000000000000000000",
        })
        .build()
    ).toThrow("Invariant failed: endTime not set");
  });

  it("endTime defaults to deadline", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const order = builder
      .startTime(deadline - 100)
      .deadline(deadline)
      .offerer("0x0000000000000000000000000000000000000000")
      .nonce(BigNumber.from(100))
      .input({
        token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        startAmount: BigNumber.from("1000000"),
        endAmount: BigNumber.from("1000000"),
      })
      .output({
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        startAmount: BigNumber.from("1000000000000000000"),
        endAmount: BigNumber.from("900000000000000000"),
        recipient: "0x0000000000000000000000000000000000000000",
      })
      .build();
    expect(order.info.endTime).toEqual(deadline);
  });

  it("endTime after deadline", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    expect(() =>
      builder
        .startTime(deadline - 100)
        .endTime(deadline + 1)
        .deadline(deadline)
        .offerer("0x0000000000000000000000000000000000000000")
        .nonce(BigNumber.from(100))
        .input({
          token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          startAmount: BigNumber.from("1000000"),
          endAmount: BigNumber.from("1000000"),
        })
        .output({
          token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          startAmount: BigNumber.from("1000000000000000000"),
          endAmount: BigNumber.from("900000000000000000"),
          recipient: "0x0000000000000000000000000000000000000000",
        })
        .build()
    ).toThrow(
      `Invariant failed: endTime must be before or same as deadline: ${
        deadline + 1
      }`
    );
  });

  it("deadline defaults to endTime", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    const order = builder
      .startTime(deadline - 100)
      .endTime(deadline)
      .offerer("0x0000000000000000000000000000000000000000")
      .nonce(BigNumber.from(100))
      .input({
        token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        startAmount: BigNumber.from("1000000"),
        endAmount: BigNumber.from("1000000"),
      })
      .output({
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        startAmount: BigNumber.from("1000000000000000000"),
        endAmount: BigNumber.from("900000000000000000"),
        recipient: "0x0000000000000000000000000000000000000000",
      })
      .build();
    expect(order.info.deadline).toEqual(deadline);
  });

  it("Must set nonce", () => {
    const deadline = Math.floor(Date.now() / 1000) + 1000;
    expect(() =>
      builder
        .deadline(deadline)
        .startTime(deadline - 100)
        .offerer("0x0000000000000000000000000000000000000000")
        .input({
          token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          startAmount: BigNumber.from("1000000"),
          endAmount: BigNumber.from("1000000"),
        })
        .output({
          token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          startAmount: BigNumber.from("1000000000000000000"),
          endAmount: BigNumber.from("900000000000000000"),
          recipient: "0x0000000000000000000000000000000000000000",
        })
        .build()
    ).toThrow("Invariant failed: nonce not set");
  });
});
