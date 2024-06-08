

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
    winner: "X" | "O" | '';
    winnerClass: string;
}
  
export interface SocketUpdateResponseType { 
    board: TicTacToeBoard;
    winner: "X" | "O" | '';
    winnerClass: string;
}