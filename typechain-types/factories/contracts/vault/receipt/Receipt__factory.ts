/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  Receipt,
  ReceiptInterface,
} from "../../../../contracts/vault/receipt/Receipt";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "information",
        type: "bytes",
      },
    ],
    name: "ReceiptInformation",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "uri",
            type: "string",
          },
        ],
        internalType: "struct ReceiptConfig",
        name: "config_",
        type: "tuple",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "ownerBurn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data_",
        type: "bytes",
      },
    ],
    name: "ownerMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from_",
        type: "address",
      },
      {
        internalType: "address",
        name: "to_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data_",
        type: "bytes",
      },
    ],
    name: "ownerTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id_",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data_",
        type: "bytes",
      },
    ],
    name: "receiptInformation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506200001c62000022565b620000e4565b600054610100900460ff16156200008f5760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff9081161015620000e2576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b612a4d80620000f46000396000f3fe608060405234801561001057600080fd5b50600436106100ff5760003560e01c80638da5cb5b11610097578063e985e9c511610066578063e985e9c514610231578063f242432a1461027a578063f2fde38b1461028d578063fc1ae255146102a057600080fd5b80638da5cb5b146101d0578063a22cb465146101f8578063ad5abbab1461020b578063d3b072fa1461021e57600080fd5b80632eb2c2d6116100d35780632eb2c2d6146101825780634e1273f41461019557806370ce8eea146101b5578063715018a6146101c857600080fd5b8062fdd58e1461010457806301ffc9a71461012a5780630e89341c1461014d578063177769cb1461016d575b600080fd5b610117610112366004611ee8565b6102b3565b6040519081526020015b60405180910390f35b61013d610138366004611f40565b610395565b6040519015158152602001610121565b61016061015b366004611f64565b610478565b6040516101219190611fe1565b61018061017b36600461210a565b61050c565b005b6101806101903660046121e6565b61051b565b6101a86101a3366004612290565b6105e4565b604051610121919061238c565b6101806101c336600461239f565b61073c565b610180610754565b60655460405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610121565b6101806102063660046123d2565b610768565b61018061021936600461240e565b610773565b61018061022c366004612473565b610788565b61013d61023f36600461250d565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260986020908152604080832093909416825291909152205460ff1690565b61018061028836600461240e565b610925565b61018061029b366004612540565b6109da565b6101806102ae36600461255b565b610a91565b600073ffffffffffffffffffffffffffffffffffffffff831661035d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201527f616c6964206f776e65720000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b50600081815260976020908152604080832073ffffffffffffffffffffffffffffffffffffffff861684529091529020545b92915050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167fd9b67a2600000000000000000000000000000000000000000000000000000000148061042857507fffffffff0000000000000000000000000000000000000000000000000000000082167f0e89341c00000000000000000000000000000000000000000000000000000000145b8061038f57507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff0000000000000000000000000000000000000000000000000000000083161461038f565b606060998054610487906125bc565b80601f01602080910402602001604051908101604052809291908181526020018280546104b3906125bc565b80156105005780601f106104d557610100808354040283529160200191610500565b820191906000526020600020905b8154815290600101906020018083116104e357829003601f168201915b50505050509050919050565b610517338383610ab6565b5050565b73ffffffffffffffffffffffffffffffffffffffff85163314806105445750610544853361023f565b6105d0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f7665640000000000000000000000000000000000006064820152608401610354565b6105dd8585858585610b87565b5050505050565b60608151835114610677576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e67746860448201527f206d69736d6174636800000000000000000000000000000000000000000000006064820152608401610354565b6000835167ffffffffffffffff81111561069357610693611ff4565b6040519080825280602002602001820160405280156106bc578160200160208202803683370190505b50905060005b8451811015610734576107078582815181106106e0576106e061260f565b60200260200101518583815181106106fa576106fa61260f565b60200260200101516102b3565b8282815181106107195761071961260f565b602090810291909101015261072d8161266d565b90506106c2565b509392505050565b610744610ed2565b61074f838383610f53565b505050565b61075c610ed2565b610766600061117a565b565b6105173383836111f1565b61077b610ed2565b6105dd8585858585611344565b600054610100900460ff16158080156107a85750600054600160ff909116105b806107c25750303b1580156107c2575060005460ff166001145b61084e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a65640000000000000000000000000000000000006064820152608401610354565b600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016600117905580156108ac57600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff166101001790555b6108b4611594565b81516108bf90611633565b801561051757600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15050565b73ffffffffffffffffffffffffffffffffffffffff851633148061094e575061094e853361023f565b61077b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f7665640000000000000000000000000000000000006064820152608401610354565b6109e2610ed2565b73ffffffffffffffffffffffffffffffffffffffff8116610a85576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610354565b610a8e8161117a565b50565b610a99610ed2565b610aa5848484846116d3565b610ab0848483610ab6565b50505050565b80511561074f576065546040517f0e0cf96800000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90911690630e0cf96890610b17908690869086906004016126a5565b60006040518083038186803b158015610b2f57600080fd5b505afa158015610b43573d6000803e3d6000fd5b505050507fd66d6a9810a5cef78b704e7e04334961e997c81d337f029f74637f060f3d8d65838383604051610b7a939291906126a5565b60405180910390a1505050565b8151835114610c18576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060448201527f6d69736d617463680000000000000000000000000000000000000000000000006064820152608401610354565b73ffffffffffffffffffffffffffffffffffffffff8416610cbb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152608401610354565b33610cca81878787878761184c565b60005b8451811015610e3d576000858281518110610cea57610cea61260f565b602002602001015190506000858381518110610d0857610d0861260f565b602090810291909101810151600084815260978352604080822073ffffffffffffffffffffffffffffffffffffffff8e168352909352919091205490915081811015610dd6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201527f72207472616e73666572000000000000000000000000000000000000000000006064820152608401610354565b600083815260976020908152604080832073ffffffffffffffffffffffffffffffffffffffff8e8116855292528083208585039055908b16825281208054849290610e229084906126e3565b9250508190555050505080610e369061266d565b9050610ccd565b508473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051610eb49291906126f6565b60405180910390a4610eca8187878787876118f6565b505050505050565b60655473ffffffffffffffffffffffffffffffffffffffff163314610766576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610354565b73ffffffffffffffffffffffffffffffffffffffff8316610ff6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f455243313135353a206275726e2066726f6d20746865207a65726f206164647260448201527f65737300000000000000000000000000000000000000000000000000000000006064820152608401610354565b33600061100284611b80565b9050600061100f84611b80565b905061102f8387600085856040518060200160405280600081525061184c565b600085815260976020908152604080832073ffffffffffffffffffffffffffffffffffffffff8a168452909152902054848110156110ee576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f455243313135353a206275726e20616d6f756e7420657863656564732062616c60448201527f616e6365000000000000000000000000000000000000000000000000000000006064820152608401610354565b600086815260976020908152604080832073ffffffffffffffffffffffffffffffffffffffff8b81168086529184528285208a8703905582518b81529384018a90529092908816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a46040805160208101909152600090525b50505050505050565b6065805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036112ac576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c2073746174757360448201527f20666f722073656c6600000000000000000000000000000000000000000000006064820152608401610354565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526098602090815260408083209487168084529482529182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff84166113e7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152608401610354565b3360006113f385611b80565b9050600061140085611b80565b905061141083898985858961184c565b600086815260976020908152604080832073ffffffffffffffffffffffffffffffffffffffff8c168452909152902054858110156114d0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201527f72207472616e73666572000000000000000000000000000000000000000000006064820152608401610354565b600087815260976020908152604080832073ffffffffffffffffffffffffffffffffffffffff8d8116855292528083208985039055908a1682528120805488929061151c9084906126e3565b9091555050604080518881526020810188905273ffffffffffffffffffffffffffffffffffffffff808b16928c821692918816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4611589848a8a8a8a8a611bcb565b505050505050505050565b600054610100900460ff1661162b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e670000000000000000000000000000000000000000006064820152608401610354565b610766611d78565b600054610100900460ff166116ca576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e670000000000000000000000000000000000000000006064820152608401610354565b610a8e81611e18565b73ffffffffffffffffffffffffffffffffffffffff8416611776576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f455243313135353a206d696e7420746f20746865207a65726f2061646472657360448201527f73000000000000000000000000000000000000000000000000000000000000006064820152608401610354565b33600061178285611b80565b9050600061178f85611b80565b90506117a08360008985858961184c565b600086815260976020908152604080832073ffffffffffffffffffffffffffffffffffffffff8b168452909152812080548792906117df9084906126e3565b9091555050604080518781526020810187905273ffffffffffffffffffffffffffffffffffffffff808a1692600092918716917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a461117183600089898989611bcb565b60655473ffffffffffffffffffffffffffffffffffffffff166040517f891e3df800000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff87811660048301528681166024830152919091169063891e3df89060440160006040518083038186803b1580156118d657600080fd5b505afa1580156118ea573d6000803e3d6000fd5b50505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff84163b15610eca576040517fbc197c8100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063bc197c819061196d908990899088908890889060040161271b565b6020604051808303816000875af19250505080156119c6575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526119c391810190612786565b60015b611aaf576119d26127a3565b806308c379a003611a2557506119e66127bf565b806119f15750611a27565b806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103549190611fe1565b505b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e2d4552433131353560448201527f526563656976657220696d706c656d656e7465720000000000000000000000006064820152608401610354565b7fffffffff0000000000000000000000000000000000000000000000000000000081167fbc197c810000000000000000000000000000000000000000000000000000000014611171576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a6563746560448201527f6420746f6b656e730000000000000000000000000000000000000000000000006064820152608401610354565b60408051600180825281830190925260609160009190602080830190803683370190505090508281600081518110611bba57611bba61260f565b602090810291909101015292915050565b73ffffffffffffffffffffffffffffffffffffffff84163b15610eca576040517ff23a6e6100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063f23a6e6190611c429089908990889088908890600401612867565b6020604051808303816000875af1925050508015611c9b575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201909252611c9891810190612786565b60015b611ca7576119d26127a3565b7fffffffff0000000000000000000000000000000000000000000000000000000081167ff23a6e610000000000000000000000000000000000000000000000000000000014611171576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a6563746560448201527f6420746f6b656e730000000000000000000000000000000000000000000000006064820152608401610354565b600054610100900460ff16611e0f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e670000000000000000000000000000000000000000006064820152608401610354565b6107663361117a565b600054610100900460ff16611eaf576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e670000000000000000000000000000000000000000006064820152608401610354565b610a8e81609961051782826128fd565b803573ffffffffffffffffffffffffffffffffffffffff81168114611ee357600080fd5b919050565b60008060408385031215611efb57600080fd5b611f0483611ebf565b946020939093013593505050565b7fffffffff0000000000000000000000000000000000000000000000000000000081168114610a8e57600080fd5b600060208284031215611f5257600080fd5b8135611f5d81611f12565b9392505050565b600060208284031215611f7657600080fd5b5035919050565b6000815180845260005b81811015611fa357602081850181015186830182015201611f87565b5060006020828601015260207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f83011685010191505092915050565b602081526000611f5d6020830184611f7d565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116810181811067ffffffffffffffff8211171561206757612067611ff4565b6040525050565b600067ffffffffffffffff83111561208857612088611ff4565b6040516120bd60207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8701160182612023565b8091508381528484840111156120d257600080fd5b83836020830137600060208583010152509392505050565b600082601f8301126120fb57600080fd5b611f5d8383356020850161206e565b6000806040838503121561211d57600080fd5b82359150602083013567ffffffffffffffff81111561213b57600080fd5b612147858286016120ea565b9150509250929050565b600067ffffffffffffffff82111561216b5761216b611ff4565b5060051b60200190565b600082601f83011261218657600080fd5b8135602061219382612151565b6040516121a08282612023565b83815260059390931b85018201928281019150868411156121c057600080fd5b8286015b848110156121db57803583529183019183016121c4565b509695505050505050565b600080600080600060a086880312156121fe57600080fd5b61220786611ebf565b945061221560208701611ebf565b9350604086013567ffffffffffffffff8082111561223257600080fd5b61223e89838a01612175565b9450606088013591508082111561225457600080fd5b61226089838a01612175565b9350608088013591508082111561227657600080fd5b50612283888289016120ea565b9150509295509295909350565b600080604083850312156122a357600080fd5b823567ffffffffffffffff808211156122bb57600080fd5b818501915085601f8301126122cf57600080fd5b813560206122dc82612151565b6040516122e98282612023565b83815260059390931b850182019282810191508984111561230957600080fd5b948201945b8386101561232e5761231f86611ebf565b8252948201949082019061230e565b9650508601359250508082111561234457600080fd5b5061214785828601612175565b600081518084526020808501945080840160005b8381101561238157815187529582019590820190600101612365565b509495945050505050565b602081526000611f5d6020830184612351565b6000806000606084860312156123b457600080fd5b6123bd84611ebf565b95602085013595506040909401359392505050565b600080604083850312156123e557600080fd5b6123ee83611ebf565b91506020830135801515811461240357600080fd5b809150509250929050565b600080600080600060a0868803121561242657600080fd5b61242f86611ebf565b945061243d60208701611ebf565b93506040860135925060608601359150608086013567ffffffffffffffff81111561246757600080fd5b612283888289016120ea565b60006020828403121561248557600080fd5b813567ffffffffffffffff8082111561249d57600080fd5b90830190602082860312156124b157600080fd5b6040516020810181811083821117156124cc576124cc611ff4565b6040528235828111156124de57600080fd5b80840193505085601f8401126124f357600080fd5b6125028684356020860161206e565b815295945050505050565b6000806040838503121561252057600080fd5b61252983611ebf565b915061253760208401611ebf565b90509250929050565b60006020828403121561255257600080fd5b611f5d82611ebf565b6000806000806080858703121561257157600080fd5b61257a85611ebf565b93506020850135925060408501359150606085013567ffffffffffffffff8111156125a457600080fd5b6125b0878288016120ea565b91505092959194509250565b600181811c908216806125d057607f821691505b602082108103612609577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361269e5761269e61263e565b5060010190565b73ffffffffffffffffffffffffffffffffffffffff841681528260208201526060604082015260006126da6060830184611f7d565b95945050505050565b8082018082111561038f5761038f61263e565b6040815260006127096040830185612351565b82810360208401526126da8185612351565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525060a0604083015261275460a0830186612351565b82810360608401526127668186612351565b9050828103608084015261277a8185611f7d565b98975050505050505050565b60006020828403121561279857600080fd5b8151611f5d81611f12565b600060033d11156127bc5760046000803e5060005160e01c5b90565b600060443d10156127cd5790565b6040517ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc803d016004833e81513d67ffffffffffffffff816024840111818411171561281b57505050505090565b82850191508151818111156128335750505050505090565b843d870101602082850101111561284d5750505050505090565b61285c60208286010187612023565b509095945050505050565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525084604083015283606083015260a060808301526128ac60a0830184611f7d565b979650505050505050565b601f82111561074f57600081815260208120601f850160051c810160208610156128de5750805b601f850160051c820191505b81811015610eca578281556001016128ea565b815167ffffffffffffffff81111561291757612917611ff4565b61292b8161292584546125bc565b846128b7565b602080601f83116001811461297e57600084156129485750858301515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600386901b1c1916600185901b178555610eca565b6000858152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08616915b828110156129cb578886015182559484019460019091019084016129ac565b5085821015612a0757878501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b5050505050600190811b0190555056fea2646970667358221220ff28558e5811064ac6c0b71cafdf05c552dd0e28816505c007d230f8841d59e764736f6c63430008110033";

type ReceiptConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ReceiptConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Receipt__factory extends ContractFactory {
  constructor(...args: ReceiptConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Receipt> {
    return super.deploy(overrides || {}) as Promise<Receipt>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Receipt {
    return super.attach(address) as Receipt;
  }
  override connect(signer: Signer): Receipt__factory {
    return super.connect(signer) as Receipt__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ReceiptInterface {
    return new utils.Interface(_abi) as ReceiptInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Receipt {
    return new Contract(address, _abi, signerOrProvider) as Receipt;
  }
}
