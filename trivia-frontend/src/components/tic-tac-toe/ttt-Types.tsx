

export type TicTacToeBoard = number[][];

export interface ChatMessage {
    userId: string;
    message: string;
}
  
export interface SocketResponseType {
    success: boolean;
    data: ResetResponseType | SocketUpdateResponseType;
    error?: string;
}
  
export interface ResetResponseType {
    board: TicTacToeBoard;
    winner: string;
    winnerClass: string;
    nextPlayer: string;
    isTie: boolean;
}
  
export interface SocketUpdateResponseType { 
    board: TicTacToeBoard;
    winner: string;
    winnerClass: string;
    nextPlayer: string;
    isTie: boolean;
}

export interface PlayersType {
    playerName: string;
    playerCode: string;
}






