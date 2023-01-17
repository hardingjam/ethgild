import { ReadWriteTier, TestErc20 } from "../../typechain-types";
import { ethers } from "hardhat";

import {
  getEventArgs,
  ADDRESS_ZERO,
  assertError,
  fixedPointMul,
  ONE,
  fixedPointDiv,
  fixedPointDivRound,
} from "../util";

import {
  SetERC20TierEvent,
  CertifyEvent,
  SnapshotEvent,
  ConfiscateSharesEvent,
  ConfiscateReceiptEvent,
  SetERC1155TierEvent,
} from "../../typechain-types/contracts/vault/offchainAsset/OffchainAssetReceiptVault";
import {
  deployOffChainAssetReceiptVault,
  deployOffchainAssetReceiptVaultFactory,
} from "./deployOffchainAssetReceiptVault";
import { DepositWithReceiptEvent } from "../../typechain-types/contracts/vault/receipt/ReceiptVault";

const assert = require("assert");

let TierV2TestContract: ReadWriteTier;
let expectedName = "OffchainAssetVaul";
let expectedSymbol = "OAV";

describe("OffChainAssetReceiptVault", async function () {
  beforeEach(async () => {
    const TierV2Test = await ethers.getContractFactory("ReadWriteTier");
    TierV2TestContract = (await TierV2Test.deploy()) as ReadWriteTier;
    await TierV2TestContract.deployed();
  });
  it("Check asset is address zero", async function () {
    const signers = await ethers.getSigners();
    const alice = signers[0];

    const offchainAssetReceiptVaultFactory =
      await deployOffchainAssetReceiptVaultFactory();

    const constructionConfig = {
      admin: alice.address,
      vaultConfig: {
        asset: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        name: "OffchainAssetVaul",
        symbol: "OAV",
      },
    };

    await assertError(
      async () =>
        await offchainAssetReceiptVaultFactory.createChildTyped(
          constructionConfig
        ),
      `NonZeroAsset`,
      "Failed to initialize"
    );
  });
  it("Constructs well", async function () {
    const [vault, receipt, config] = await deployOffChainAssetReceiptVault();

    assert(
      config.receiptVaultConfig.vaultConfig.name === expectedName,
      `wrong name expected ${expectedName} got ${config.receiptVaultConfig.vaultConfig.name}`
    );
    assert(
      config.receiptVaultConfig.vaultConfig.asset === ADDRESS_ZERO,
      `wrong asset expected ${ADDRESS_ZERO} got ${config.receiptVaultConfig.vaultConfig.asset}`
    );

    assert(
      config.receiptVaultConfig.vaultConfig.symbol === expectedSymbol,
      `wrong symbol expected ${expectedSymbol} got ${config.receiptVaultConfig.vaultConfig.symbol}`
    );
  });
  it("Check vault is the owner of its receipt", async function () {
    const [vault, receipt] = await deployOffChainAssetReceiptVault();
    const signers = await ethers.getSigners();
    const alice = signers[0];

    const owner = await receipt.connect(alice).owner();
    assert(
      vault.address === (await receipt.connect(alice).owner()),
      `wrong owner expected ${vault.address} got ${owner}`
    );
  });
  it("Checks SetERC20Tier event is emitted", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();

    const signers = await ethers.getSigners();
    const alice = signers[0];

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).ERC20TIERER(), alice.address);
    const minTier = ethers.BigNumber.from(10);

    const { sender, tier, minimumTier } = (await getEventArgs(
      await vault
        .connect(alice)
        .setERC20Tier(TierV2TestContract.address, minTier, []),
      "SetERC20Tier",
      vault
    )) as SetERC20TierEvent["args"];

    assert(
      sender === alice.address,
      `wrong sender expected ${alice.address} got ${sender}`
    );
    assert(
      tier === TierV2TestContract.address,
      `wrong tier expected ${TierV2TestContract.address} got ${tier}`
    );
    assert(
      minimumTier.eq(minTier),
      `wrong minimumTier expected ${minTier} got ${minimumTier}`
    );
  });
  it("Checks setERC1155Tier event is emitted", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();

    const signers = await ethers.getSigners();
    const alice = signers[0];

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).ERC1155TIERER(), alice.address);
    const minTier = ethers.BigNumber.from(100);

    const { sender, tier, minimumTier } = (await getEventArgs(
      await vault
        .connect(alice)
        .setERC1155Tier(TierV2TestContract.address, minTier, []),
      "SetERC1155Tier",
      vault
    )) as SetERC1155TierEvent["args"];

    assert(
      sender === alice.address,
      `wrong sender expected ${alice.address} got ${sender}`
    );
    assert(
      tier === TierV2TestContract.address,
      `wrong tier expected ${TierV2TestContract.address} got ${tier}`
    );
    assert(
      minimumTier.eq(minTier),
      `wrong minimumTier expected ${minTier} got ${minimumTier}`
    );
  });
  it("Checks totalAssets", async function () {
    const signers = await ethers.getSigners();
    const [vault] = await deployOffChainAssetReceiptVault();

    const testErc20 = await ethers.getContractFactory("TestErc20");
    const asset = (await testErc20.deploy()) as TestErc20;
    await asset.deployed();

    const alice = signers[0];
    const bob = signers[2];

    const shareRatio = ONE;
    const aliceAssets = ethers.BigNumber.from(1000);

    await asset.connect(alice).transfer(alice.address, aliceAssets);

    await asset.connect(alice).increaseAllowance(vault.address, aliceAssets);

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).DEPOSITOR(), alice.address);

    await vault
      .connect(alice)
      ["deposit(uint256,address,uint256,bytes)"](
        aliceAssets,
        bob.address,
        shareRatio,
        []
      );

    const totalSupply = await vault.connect(alice).totalSupply();
    const totalAssets = await vault.connect(alice).totalAssets();

    assert(
      totalSupply.eq(totalAssets),
      `Wrong total assets. Expected ${totalSupply} got ${totalAssets}`
    );
  });
  it("PreviewDeposit returns correct shares", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();
    const assets = ethers.BigNumber.from(100);

    const signers = await ethers.getSigners();
    const alice = signers[0];

    const hasRoleDepositor = await vault
      .connect(alice)
      .hasRole(await vault.connect(alice).DEPOSITOR(), alice.address);

    //Alice does not have role of depositor, so it should throw an error unless role is granted
    assert(
      !hasRoleDepositor,
      `AccessControl: account ${alice.address.toLowerCase()} is missing role DEPOSITOR`
    );

    //grant depositor role to alice
    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).DEPOSITOR(), alice.address);

    const shares = await vault.connect(alice).previewDeposit(assets);

    assert(
      shares.eq(assets),
      `Wrong shares: expected ${assets} got ${shares} `
    );
  });
  it("PreviewMint returns 0 if not DEPOSITOR", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();
    const shares = ethers.BigNumber.from(100);
    const signers = await ethers.getSigners();
    const alice = signers[0];

    const assets = await vault.connect(alice).previewMint(shares);
    const expectedAssets = ethers.BigNumber.from(0);

    assert(
      assets.eq(expectedAssets),
      `Wrong assets: expected ${expectedAssets} got ${assets} `
    );
  });
  it("PreviewMint returns correct assets", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();
    const shares = ethers.BigNumber.from(10);

    const signers = await ethers.getSigners();
    const alice = signers[0];

    //grant depositor role to alice
    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).DEPOSITOR(), alice.address);

    const assets = await vault.connect(alice).previewMint(shares);
    const expectedAssets = fixedPointDivRound(shares, ONE);
    assert(
      assets.eq(expectedAssets),
      `Wrong assets: expected ${expectedAssets} got ${assets}`
    );
  });
  it("PreviewWithdraw returns 0 shares if no withdrawer role", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();
    const assets = ethers.BigNumber.from(100);

    const signers = await ethers.getSigners();
    const alice = signers[0];

    const id = ethers.BigNumber.from(1);

    const expectedShares = ethers.BigNumber.from(0);

    const shares = await vault
      .connect(alice)
      ["previewWithdraw(uint256,uint256)"](assets, id);

    assert(
      shares.eq(expectedShares),
      `Wrong shares: expected ${expectedShares} got ${shares} `
    );
  });
  it("PreviewWithdraw returns correct shares", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();
    const assets = ethers.BigNumber.from(10);

    const signers = await ethers.getSigners();
    const alice = signers[0];

    //assets are always deposited 1:1 with shares
    const id = ONE;

    //grant withdrawer role to alice
    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).WITHDRAWER(), alice.address);

    const expectedShares = fixedPointMul(assets, id);

    const shares = await vault
      .connect(alice)
      ["previewWithdraw(uint256,uint256)"](assets, id);

    assert(
      shares.eq(expectedShares),
      `Wrong shares: expected ${expectedShares} got ${shares} `
    );
  });
  it("PreviewRedeem returns correct assets", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();
    const shares = ethers.BigNumber.from(100);

    const signers = await ethers.getSigners();
    const alice = signers[0];

    const id = ONE;

    const hasRoleDepositor = await vault
      .connect(alice)
      .hasRole(await vault.connect(alice).WITHDRAWER(), alice.address);

    //Alice does not have role of withdrawer, so it should throw an error unless role is granted
    assert(
      !hasRoleDepositor,
      `AccessControl: account ${alice.address.toLowerCase()} is missing role WITHDRAWER`
    );

    //grant withdrawer role to alice
    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).WITHDRAWER(), alice.address);

    const expectedAssets = fixedPointDiv(shares, id);
    const assets = await vault
      .connect(alice)
      ["previewRedeem(uint256,uint256)"](shares, id);

    assert(
      assets.eq(expectedAssets),
      `Wrong assets: expected ${expectedAssets} got ${assets} `
    );
  });
  it("PreviewRedeem returns 0 shares if no withdrawer role", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();
    const shares = ethers.BigNumber.from(100);

    const signers = await ethers.getSigners();
    const alice = signers[0];

    const id = ONE;

    const expectedAssets = ethers.BigNumber.from(0);
    const assets = await vault
      .connect(alice)
      ["previewRedeem(uint256,uint256)"](shares, id);

    assert(
      assets.eq(expectedAssets),
      `Wrong assets: expected ${expectedAssets} got ${assets} `
    );
  });
  it("Redeposit - should be receipt holder", async function () {
    const signers = await ethers.getSigners();
    const alice = signers[0];
    const [vault, receipt] = await deployOffChainAssetReceiptVault();

    const aliceReceiptBalance = await receipt
      .connect(alice)
      .balanceOf(alice.address, ONE);

    assert(aliceReceiptBalance.eq(0), `NOT_RECEIPT_HOLDER`);
  });
  it("Redeposits", async function () {
    const signers = await ethers.getSigners();
    const [vault, receipt] = await deployOffChainAssetReceiptVault();

    const testErc20 = await ethers.getContractFactory("TestErc20");
    const asset = (await testErc20.deploy()) as TestErc20;
    await asset.deployed();

    const alice = signers[0];

    const receiptId = ethers.BigNumber.from(1);
    const aliceAssets = ethers.BigNumber.from(20);

    await asset.connect(alice).transfer(alice.address, aliceAssets);

    await asset.connect(alice).increaseAllowance(vault.address, aliceAssets);

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).DEPOSITOR(), alice.address);

    const assetToDeposit = aliceAssets.div(2);
    const assetToReDeposit = ethers.BigNumber.from(10);
    await vault
      .connect(alice)
      ["deposit(uint256,address,uint256,bytes)"](
        assetToDeposit,
        alice.address,
        receiptId,
        []
      );

    const aliceReceiptBalance = await receipt
      .connect(alice)
      .balanceOf(alice.address, receiptId);

    await vault
      .connect(alice)
      .redeposit(assetToReDeposit, alice.address, 1, [1]);

    const aliceReceiptBalanceAfterRedeposit = await receipt
      .connect(alice)
      .balanceOf(alice.address, receiptId);

    assert(
      aliceReceiptBalanceAfterRedeposit.eq(
        aliceReceiptBalance.add(assetToReDeposit)
      ),
      `Incorrect balance ${aliceReceiptBalance.add(
        assetToReDeposit
      )} got ${aliceReceiptBalanceAfterRedeposit}`
    );
  });
  it("Redeposit on non-existing receipt", async function () {
    const signers = await ethers.getSigners();
    const [vault] = await deployOffChainAssetReceiptVault();

    const testErc20 = await ethers.getContractFactory("TestErc20");
    const asset = (await testErc20.deploy()) as TestErc20;
    await asset.deployed();

    const alice = signers[0];

    const assetToReDeposit = ethers.BigNumber.from(10);

    //there are no any mints yet. so id= 1 should be unexpected
    const id = 1;

    await assertError(
      async () =>
        await vault
          .connect(alice)
          .redeposit(assetToReDeposit, alice.address, id, [1]),
      `UnexpectedId`,
      "Failed to redeposit"
    );
  });
  it("Snapshot event is emitted", async function () {
    const signers = await ethers.getSigners();
    const alice = signers[0];
    const [vault] = await deployOffChainAssetReceiptVault();

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).ERC20SNAPSHOTTER(), alice.address);

    const { id } = (await getEventArgs(
      await vault.connect(alice).snapshot(),
      "Snapshot",
      vault
    )) as SnapshotEvent["args"];

    assert(id.eq(ethers.BigNumber.from(1)), `ID not set`);
  });
  it("Sets correct erc20Tier and mintier", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();

    const signers = await ethers.getSigners();
    const alice = signers[0];

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).ERC20TIERER(), alice.address);
    const minTier = ethers.BigNumber.from(10);

    const { tier, minimumTier } = (await getEventArgs(
      await vault
        .connect(alice)
        .setERC20Tier(TierV2TestContract.address, minTier, []),
      "SetERC20Tier",
      vault
    )) as SetERC20TierEvent["args"];

    await vault
      .connect(alice)
      .setERC20Tier(TierV2TestContract.address, minTier, []);

    assert(
      tier === TierV2TestContract.address,
      `wrong tier expected ${TierV2TestContract.address} got ${tier}`
    );
    assert(
      minimumTier.eq(minTier),
      `wrong minimumTier expected ${minTier} got ${minimumTier}`
    );
  });
  it("Sets correct erc11Tier and mintier", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();

    const signers = await ethers.getSigners();
    const alice = signers[0];

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).ERC1155TIERER(), alice.address);
    const minTier = ethers.BigNumber.from(10);

    const { tier, minimumTier } = (await getEventArgs(
      await vault
        .connect(alice)
        .setERC1155Tier(TierV2TestContract.address, minTier, []),
      "SetERC1155Tier",
      vault
    )) as SetERC20TierEvent["args"];

    await vault
      .connect(alice)
      .setERC1155Tier(TierV2TestContract.address, minTier, []);

    assert(
      tier === TierV2TestContract.address,
      `wrong tier expected ${TierV2TestContract.address} got ${tier}`
    );
    assert(
      minimumTier.eq(minTier),
      `wrong minimumTier expected ${minTier} got ${minimumTier}`
    );
  });
  it("Checks Certify event is emitted", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();

    const signers = await ethers.getSigners();
    const alice = signers[0];

    //get block timestamp and add 100 to get _until
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const _until = block.timestamp + 100;
    const _referenceBlockNumber = block.number;

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CERTIFIER(), alice.address);

    const { sender, certifyUntil, referenceBlockNumber } = (await getEventArgs(
      await vault
        .connect(alice)
        .certify(_until, _referenceBlockNumber, false, []),
      "Certify",
      vault
    )) as CertifyEvent["args"];

    assert(
      sender === alice.address,
      `wrong sender expected ${alice.address} got ${sender}`
    );
    assert(
      certifyUntil.eq(_until),
      `wrong until expected ${_until} got ${certifyUntil}`
    );
    assert(
      referenceBlockNumber.eq(_referenceBlockNumber),
      `wrong referenceBlockNumber expected ${_referenceBlockNumber} got ${referenceBlockNumber}`
    );
  });
  it("Certifies with data", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();

    const signers = await ethers.getSigners();
    const alice = signers[0];

    //get block timestamp and add 100 to get _until
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const _until = block.timestamp + 100;
    const _referenceBlockNumber = block.number;

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CERTIFIER(), alice.address);

    const { sender, certifyUntil, referenceBlockNumber, data } =
      (await getEventArgs(
        await vault
          .connect(alice)
          .certify(_until, _referenceBlockNumber, false, [1, 7]),
        "Certify",
        vault
      )) as CertifyEvent["args"];

    assert(
      sender === alice.address,
      `wrong sender expected ${alice.address} got ${sender}`
    );
    assert(data === "0x0107", `wrong data expected 0x0107 got ${data}`);
    assert(
      certifyUntil.eq(_until),
      `wrong until expected ${_until} got ${certifyUntil}`
    );
    assert(
      referenceBlockNumber.eq(_referenceBlockNumber),
      `wrong referenceBlockNumber expected ${_referenceBlockNumber} got ${referenceBlockNumber}`
    );
  });
  it("Certify in the past relative to the existing certification time with forceUntil true", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();

    const signers = await ethers.getSigners();
    const alice = signers[0];

    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const _until = block.timestamp + 100;
    const _referenceBlockNumber = block.number;

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CERTIFIER(), alice.address);

    const { certifyUntil } = (await getEventArgs(
      await vault
        .connect(alice)
        .certify(_until, _referenceBlockNumber, false, []),
      "Certify",
      vault
    )) as CertifyEvent["args"];

    const _untilPast = certifyUntil.sub(100);

    const eventArgs = (await getEventArgs(
      await vault
        .connect(alice)
        .certify(_untilPast, _referenceBlockNumber, true, []),
      "Certify",
      vault
    )) as CertifyEvent["args"];

    assert(
      eventArgs.certifyUntil.eq(_untilPast),
      `wrong until expected ${_untilPast} got ${eventArgs.certifyUntil}`
    );
  });
  it("Checks certifiedUntil is not zero", async function () {
    const signers = await ethers.getSigners();
    const alice = signers[0];
    const [vault] = await deployOffChainAssetReceiptVault();

    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const _certifiedUntil = ethers.BigNumber.from(0);
    const _referenceBlockNumber = block.number;

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CERTIFIER(), alice.address);

    await assertError(
      async () =>
        await vault
          .connect(alice)
          .certify(_certifiedUntil, _referenceBlockNumber, false, []),
      `ZeroCertifyUntil`,
      "failed to certify"
    );
  });
  it("Checks referenceBlockNumber is less than block number", async function () {
    const signers = await ethers.getSigners();
    const alice = signers[0];
    const [vault] = await deployOffChainAssetReceiptVault();

    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const _certifiedUntil = block.timestamp + 100;
    const _referenceBlockNumber = blockNum + 10;

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CERTIFIER(), alice.address);

    await assertError(
      async () =>
        await vault
          .connect(alice)
          .certify(_certifiedUntil, _referenceBlockNumber, false, []),
      `FutureReferenceBlock`,
      "failed to certify"
    );
  });
  it("Certifies", async function () {
    const signers = await ethers.getSigners();
    const alice = signers[0];
    const [vault] = await deployOffChainAssetReceiptVault();

    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const _certifiedUntil = block.timestamp + 100;
    const _referenceBlockNumber = block.number;

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CERTIFIER(), alice.address);

    const { certifyUntil } = (await getEventArgs(
      await vault
        .connect(alice)
        .certify(_certifiedUntil, _referenceBlockNumber, false, []),
      "Certify",
      vault
    )) as CertifyEvent["args"];

    assert(
      certifyUntil.eq(_certifiedUntil),
      `wrong until expected ${_certifiedUntil} got ${certifyUntil}`
    );
  });
  it("AuthorizeReceiptTransfer reverts if certification expired", async function () {
    const signers = await ethers.getSigners();
    const alice = signers[0];
    const [vault] = await deployOffChainAssetReceiptVault();

    await assertError(
      async () =>
        await vault
          .connect(alice)
          .authorizeReceiptTransfer(alice.address, alice.address),
      `CertificationExpired`,
      "failed to AuthorizeReceiptTransfer"
    );
  });
  it("Confiscate - Checks role CONFISCATOR", async function () {
    const signers = await ethers.getSigners();
    const alice = signers[0];
    const [vault] = await deployOffChainAssetReceiptVault();

    await assertError(
      async () => await vault.connect(alice).confiscateShares(alice.address),
      `AccessControl: account ${alice.address.toLowerCase()} is missing role ${await vault
        .connect(alice)
        .CONFISCATOR()}`,
      "failed to confiscate"
    );
  });
  it("Confiscate - Checks ConfiscateShares is emitted", async function () {
    const signers = await ethers.getSigners();
    const alice = signers[0];
    const [vault] = await deployOffChainAssetReceiptVault();

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CONFISCATOR(), alice.address);

    const { sender, confiscatee } = (await getEventArgs(
      await vault.connect(alice).confiscateShares(alice.address),
      "ConfiscateShares",
      vault
    )) as ConfiscateSharesEvent["args"];

    assert(
      sender === alice.address,
      `wrong sender expected ${alice.address} got ${sender}`
    );
    assert(
      confiscatee === alice.address,
      `wrong confiscatee expected ${alice.address} got ${confiscatee}`
    );
  });
  it("Confiscate receipts - Checks ConfiscateReceipt is emitted", async function () {
    const signers = await ethers.getSigners();
    const alice = signers[0];
    const [vault] = await deployOffChainAssetReceiptVault();

    const _id = ONE;

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CONFISCATOR(), alice.address);

    const { sender, confiscatee, id } = (await getEventArgs(
      await vault.connect(alice).confiscateReceipt(alice.address, _id),
      "ConfiscateReceipt",
      vault
    )) as ConfiscateReceiptEvent["args"];

    assert(
      sender === alice.address,
      `wrong sender expected ${alice.address} got ${sender}`
    );
    assert(
      confiscatee === alice.address,
      `wrong confiscatee expected ${alice.address} got ${confiscatee}`
    );
    assert(id.eq(_id), `wrong id expected ${_id} got ${id}`);
  });
  it("Checks confiscated is same as balance", async function () {
    const signers = await ethers.getSigners();
    const alice = signers[0];
    const [vault] = await deployOffChainAssetReceiptVault();

    const testErc20 = await ethers.getContractFactory("TestErc20");
    const asset = (await testErc20.deploy()) as TestErc20;
    await asset.deployed();

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CONFISCATOR(), alice.address);
    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).DEPOSITOR(), alice.address);

    const assets = ethers.BigNumber.from(100);

    await asset.transfer(alice.address, assets);

    await asset
      .connect(alice)
      .increaseAllowance(vault.connect(alice).address, assets);

    await vault
      .connect(alice)
      ["deposit(uint256,address,uint256,bytes)"](
        assets,
        alice.address,
        ONE,
        []
      );

    const shares = await vault
      .connect(alice)
      ["balanceOf(address)"](alice.address);

    const { confiscated } = (await getEventArgs(
      await vault.connect(alice).confiscateShares(alice.address),
      "ConfiscateShares",
      vault
    )) as ConfiscateSharesEvent["args"];

    assert(
      confiscated.eq(shares),
      `wrong confiscated expected ${shares} got ${confiscated}`
    );
  });
  it("Checks confiscated is transferred", async function () {
    const signers = await ethers.getSigners();
    const alice = signers[0];
    const bob = signers[1];
    const [vault] = await deployOffChainAssetReceiptVault();

    const testErc20 = await ethers.getContractFactory("TestErc20");
    const asset = (await testErc20.deploy()) as TestErc20;
    await asset.deployed();

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CONFISCATOR(), alice.address);
    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).DEPOSITOR(), alice.address);

    const assets = ethers.BigNumber.from(100);

    await asset.transfer(alice.address, assets);

    await asset
      .connect(alice)
      .increaseAllowance(vault.connect(alice).address, assets);

    await vault
      .connect(alice)
      ["deposit(uint256,address,uint256,bytes)"](assets, bob.address, ONE, []);
    const aliceBalanceBef = await vault
      .connect(alice)
      ["balanceOf(address)"](alice.address);

    const { confiscated } = (await getEventArgs(
      await vault.connect(alice).confiscateShares(bob.address),
      "ConfiscateShares",
      vault
    )) as ConfiscateSharesEvent["args"];

    const aliceBalanceAft = await vault
      .connect(alice)
      ["balanceOf(address)"](alice.address);
    assert(
      aliceBalanceAft.eq(aliceBalanceBef.add(confiscated)),
      `Shares has not been confiscated`
    );
  });
  it("Checks confiscated is same as receipt balance", async function () {
    const signers = await ethers.getSigners();
    const [vault, receipt] = await deployOffChainAssetReceiptVault();

    const testErc20 = await ethers.getContractFactory("TestErc20");
    const asset = (await testErc20.deploy()) as TestErc20;
    await asset.deployed();

    const alice = signers[0];
    const bob = signers[1];

    const aliceAssets = ethers.BigNumber.from(1000);

    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const _certifiedUntil = block.timestamp + 100;
    const _referenceBlockNumber = block.number;
    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CERTIFIER(), alice.address);
    await vault
      .connect(alice)
      .certify(_certifiedUntil, _referenceBlockNumber, false, []);

    await asset.transfer(alice.address, aliceAssets);

    await asset.connect(alice).increaseAllowance(vault.address, aliceAssets);

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).DEPOSITOR(), alice.address);
    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CONFISCATOR(), alice.address);

    const { id } = (await getEventArgs(
      await vault
        .connect(alice)
        ["deposit(uint256,address,uint256,bytes)"](
          aliceAssets,
          bob.address,
          ONE,
          []
        ),
      "DepositWithReceipt",
      vault
    )) as DepositWithReceiptEvent["args"];

    const bobReceiptBalance = await receipt
      .connect(alice)
      ["balanceOf(address,uint256)"](bob.address, id);

    const erc20balanceBef = await vault.connect(alice).balanceOf(bob.address);

    const { confiscated } = (await getEventArgs(
      await vault.connect(alice).confiscateReceipt(bob.address, id),
      "ConfiscateReceipt",
      vault
    )) as ConfiscateSharesEvent["args"];

    const erc20balanceAft = await vault.connect(alice).balanceOf(bob.address);

    assert(
      confiscated.eq(bobReceiptBalance),
      `wrong confiscated expected ${bobReceiptBalance} got ${confiscated}`
    );
    //Check erc20 balance did not change
    assert(
      erc20balanceAft.eq(erc20balanceBef),
      `wrong erc20 expected ${erc20balanceBef} got ${erc20balanceAft}`
    );
  });
  it("Checks confiscated amount is transferred", async function () {
    const signers = await ethers.getSigners();
    const [vault, receipt] = await deployOffChainAssetReceiptVault();

    const alice = signers[0];
    const bob = signers[1];

    const testErc20 = await ethers.getContractFactory("TestErc20");
    const asset = (await testErc20.deploy()) as TestErc20;
    await asset.deployed();

    const aliceAssets = ethers.BigNumber.from(1000);

    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const _certifiedUntil = block.timestamp + 100;
    const _referenceBlockNumber = block.number;
    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CERTIFIER(), alice.address);
    await vault
      .connect(alice)
      .certify(_certifiedUntil, _referenceBlockNumber, false, []);

    await asset.transfer(alice.address, aliceAssets);

    await asset.connect(alice).increaseAllowance(vault.address, aliceAssets);

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).DEPOSITOR(), alice.address);
    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CONFISCATOR(), alice.address);

    const { id } = (await getEventArgs(
      await vault
        .connect(alice)
        ["deposit(uint256,address,uint256,bytes)"](
          aliceAssets,
          bob.address,
          ONE,
          []
        ),
      "DepositWithReceipt",
      vault
    )) as DepositWithReceiptEvent["args"];

    const aliceBalanceBef = await receipt
      .connect(alice)
      ["balanceOf(address,uint256)"](alice.address, id);

    const { confiscated } = (await getEventArgs(
      await vault.connect(alice).confiscateReceipt(bob.address, id),
      "ConfiscateReceipt",
      vault
    )) as ConfiscateSharesEvent["args"];

    const aliceBalanceAft = await receipt
      .connect(alice)
      ["balanceOf(address,uint256)"](alice.address, id);

    assert(
      aliceBalanceAft.eq(aliceBalanceBef.add(confiscated)),
      `Shares has not been confiscated`
    );
  });
  it("Should call multicall", async () => {
    this.timeout(0);
    const signers = await ethers.getSigners();
    const alice = signers[0];
    const bob = signers[1];

    const [vault, receipt] = await deployOffChainAssetReceiptVault();
    const testErc20 = await ethers.getContractFactory("TestErc20");
    const testErc20Contract = (await testErc20.deploy()) as TestErc20;
    await testErc20Contract.deployed();

    const assets = ethers.BigNumber.from(30);
    await testErc20Contract.transfer(bob.address, assets);
    await testErc20Contract
      .connect(bob)
      .increaseAllowance(vault.address, assets);

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).DEPOSITOR(), bob.address);

    const shares = ethers.BigNumber.from(10);
    const shares2 = ethers.BigNumber.from(20);
    await vault
      .connect(bob)
      ["mint(uint256,address,uint256,bytes)"](shares, bob.address, 1, []);
    await vault
      .connect(bob)
      ["mint(uint256,address,uint256,bytes)"](shares2, bob.address, 2, []);

    let ABI = [
      "function redeem(uint256 shares_, address receiver_, address owner_, uint256 id_)",
    ];
    let iface = new ethers.utils.Interface(ABI);
    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).WITHDRAWER(), bob.address);

    await vault
      .connect(bob)
      .multicall(
        [
          iface.encodeFunctionData("redeem", [
            ethers.BigNumber.from(10),
            bob.address,
            bob.address,
            1,
          ]),
          iface.encodeFunctionData("redeem", [
            ethers.BigNumber.from(20),
            bob.address,
            bob.address,
            2,
          ]),
        ],
        { from: bob.address }
      );

    let balance1 = await receipt
      .connect(alice)
      ["balanceOf(address,uint256)"](bob.address, 1);
    let balance2 = await receipt
      .connect(alice)
      ["balanceOf(address,uint256)"](bob.address, 2);

    assert(
      balance1.eq(ethers.BigNumber.from(0)) &&
        balance2.eq(ethers.BigNumber.from(0)),
      `Shares has not been redeemed`
    );
  });
  it("Should not withdraw on more than balance", async function () {
    const [vault, receipt] = await deployOffChainAssetReceiptVault();

    const signers = await ethers.getSigners();
    const alice = signers[0];
    const id = ethers.BigNumber.from(1);

    //grant depositor role to alice
    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).DEPOSITOR(), alice.address);

    const testErc20 = await ethers.getContractFactory("TestErc20");
    const testErc20Contract = (await testErc20.deploy()) as TestErc20;
    await testErc20Contract.deployed();

    const assets = ethers.BigNumber.from(30);
    await testErc20Contract.transfer(alice.address, assets);
    await testErc20Contract
      .connect(alice)
      .increaseAllowance(vault.address, assets);

    const shares = ethers.BigNumber.from(10);
    await vault
      .connect(alice)
      ["mint(uint256,address,uint256,bytes)"](shares, alice.address, 1, []);

    const balance = await receipt.connect(alice).balanceOf(alice.address, id);

    await assertError(
      async () =>
        await vault
          .connect(alice)
          ["redeem(uint256,address,address,uint256)"](
            balance.add(1),
            alice.address,
            alice.address,
            id
          ),
      "ERC20: burn amount exceeds balance",
      "failed to prevent withdraw on more than balance"
    );
  });
  it("User not being able to withdraw someone else's share", async function () {
    const [vault, receipt] = await deployOffChainAssetReceiptVault();

    const signers = await ethers.getSigners();
    const alice = signers[0];
    const bob = signers[1];
    const id = ethers.BigNumber.from(1);

    //grant depositor role to alice
    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).DEPOSITOR(), alice.address);

    const testErc20 = await ethers.getContractFactory("TestErc20");
    const testErc20Contract = (await testErc20.deploy()) as TestErc20;
    await testErc20Contract.deployed();

    const assets = ethers.BigNumber.from(30);
    await testErc20Contract.transfer(alice.address, assets);
    await testErc20Contract
      .connect(alice)
      .increaseAllowance(vault.address, assets);

    const shares = ethers.BigNumber.from(10);
    await vault
      .connect(alice)
      ["mint(uint256,address,uint256,bytes)"](shares, alice.address, 1, []);

    const balance = await receipt.connect(alice).balanceOf(alice.address, id);

    await assertError(
      async () =>
        await vault
          .connect(bob)
          ["redeem(uint256,address,address,uint256)"](
            balance,
            alice.address,
            alice.address,
            id
          ),
      "ERC20: insufficient allowance",
      "failed to prevent withdraw on someone else's shares"
    );
  });
  it("Prevent authorizeReceiptTransfer if system not certified", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();

    const signers = await ethers.getSigners();
    const alice = signers[0];
    const bob = signers[1];

    await assertError(
      async () =>
        await vault
          .connect(alice)
          .authorizeReceiptTransfer(alice.address, bob.address),
      "CertificationExpired",
      "failed to prevent authorizeReceiptTransfer"
    );
  });
  it("Prevent authorizeReceiptTransfer if unauthorizedSenderTier", async function () {
    const [vault] = await deployOffChainAssetReceiptVault();

    const signers = await ethers.getSigners();
    const alice = signers[0];
    const bob = signers[1];

    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);

    const _until = block.timestamp + 100;
    const _referenceBlockNumber = block.number;

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).CERTIFIER(), alice.address);

    await vault
      .connect(alice)
      .certify(_until, _referenceBlockNumber, false, []);

    await vault
      .connect(alice)
      .grantRole(await vault.connect(alice).ERC1155TIERER(), alice.address);
    const minTier = ethers.BigNumber.from(1);

    await vault
      .connect(alice)
      .setERC1155Tier(TierV2TestContract.address, minTier, []);

    await assertError(
      async () =>
        await vault
          .connect(alice)
          .authorizeReceiptTransfer(alice.address, bob.address),
      "UnauthorizedSenderTier",
      "failed to prevent UnauthorizedSenderTier"
    );
  });
});
