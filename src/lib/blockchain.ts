
import { sha256 } from 'crypto-hash';

interface Block {
  index: number;
  timestamp: number;
  vote: VoteData;
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface VoteData {
  voterId: string;
  candidateId: string;
  timestamp: number;
}

export class Blockchain {
  private chain: Block[];
  private difficulty: number;
  private pendingVotes: VoteData[];
  private voterRegistry: Set<string>;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingVotes = [];
    this.voterRegistry = new Set();
  }

  private createGenesisBlock(): Block {
    return {
      index: 0,
      timestamp: Date.now(),
      vote: { voterId: '0', candidateId: '0', timestamp: Date.now() },
      previousHash: '0',
      hash: '0',
      nonce: 0,
    };
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  async mineBlock(vote: VoteData): Promise<Block> {
    const previousBlock = this.getLatestBlock();
    const newBlock: Block = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      vote,
      previousHash: previousBlock.hash,
      hash: '',
      nonce: 0,
    };

    await this.proofOfWork(newBlock);
    this.chain.push(newBlock);
    return newBlock;
  }

  private async proofOfWork(block: Block): Promise<void> {
    const target = Array(this.difficulty + 1).join('0');
    while (block.hash.substring(0, this.difficulty) !== target) {
      block.nonce++;
      block.hash = await this.calculateHash(block);
    }
    console.log(`Block mined: ${block.hash}`);
  }

  private async calculateHash(block: Block): Promise<string> {
    return await sha256(
      block.index +
        block.previousHash +
        block.timestamp +
        JSON.stringify(block.vote) +
        block.nonce
    );
  }

  async addVote(vote: VoteData): Promise<boolean> {
    // Check if voter has already voted
    if (this.voterRegistry.has(vote.voterId)) {
      return false;
    }
    
    // Register voter
    this.voterRegistry.add(vote.voterId);
    
    // Mine the block and add to chain
    await this.mineBlock(vote);
    return true;
  }

  getChain(): Block[] {
    return [...this.chain];
  }
  
  getCandidateVotes(candidateId: string): number {
    return this.chain.filter(block => 
      block.index > 0 && block.vote.candidateId === candidateId
    ).length;
  }
  
  getAllVotes(): { [candidateId: string]: number } {
    const voteCounts: { [candidateId: string]: number } = {};
    
    this.chain.forEach(block => {
      if (block.index > 0) { // Skip genesis block
        const candidateId = block.vote.candidateId;
        voteCounts[candidateId] = (voteCounts[candidateId] || 0) + 1;
      }
    });
    
    return voteCounts;
  }
  
  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      
      // Validate hash
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
  
  getTotalVotes(): number {
    return this.chain.length - 1; // Subtract 1 for genesis block
  }
}

// Create a singleton instance
export const voteChain = new Blockchain();
