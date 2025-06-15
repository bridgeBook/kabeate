// ボールの型定義
export type Ball = {
    x: number;      // X座標
    y: number;      // Y座標
    dx: number;     // X方向の速度
    dy: number;     // Y方向の速度
    radius: number; // ボールの半径
  };
  
  // パドルの型定義
  export type Paddle = {
    x: number;      // X座標
    y: number;      // Y座標（通常は固定）
    width: number;  // 幅
    height: number; // 高さ
    speed: number;  // 横移動の速さ
  };
  