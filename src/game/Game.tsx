import { useEffect, useRef, useState } from 'react';
import type { Ball, Paddle } from './types';

const Game: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wallHitCount = useRef(0);
    const [displayCount, setDisplayCount] = useState(0);
    const isGameOver = useRef(false);
    const [isRunning, setIsRunning] = useState(false);

    const wallColor = darkMode ? 'white' : 'black';
    const barColor = darkMode ? 'white' : 'black';

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayCount(wallHitCount.current);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        let ball: Ball = {
            x: width / 2,
            y: height / 2,
            dx: 1,
            dy: -1,
            radius: 10,
        };

        let paddle: Paddle = {
            x: width / 2 - 50,
            y: height - 20,
            width: 100,
            height: 10,
            speed: 7,
        };

        let rightPressed = false;
        let leftPressed = false;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') rightPressed = true;
            if (e.key === 'ArrowLeft') leftPressed = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') rightPressed = false;
            if (e.key === 'ArrowLeft') leftPressed = false;
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        const drawWalls = () => {
            ctx.fillStyle = wallColor;
            const wallThickness = 10;
            ctx.fillRect(0, 0, width, wallThickness);
            ctx.fillRect(0, 0, wallThickness, height);
            ctx.fillRect(width - wallThickness, 0, wallThickness, height);
        };

        const drawBall = () => {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#09f';
            ctx.fill();
            ctx.closePath();
        };

        const drawPaddle = () => {
            ctx.fillStyle = barColor;
            ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        };

        const update = () => {
            ball.x += ball.dx;
            ball.y += ball.dy;

            const wallThickness = 10;
            const speedUpFactor = 1.1;
            const maxSpeed = 10;

            const limitSpeed = (v: number) => {
                if (v > maxSpeed) return maxSpeed;
                if (v < -maxSpeed) return -maxSpeed;
                return v;
            };

            if (ball.x < ball.radius + wallThickness || ball.x > width - ball.radius - wallThickness) {
                ball.dx = limitSpeed(-ball.dx * speedUpFactor);
                wallHitCount.current += 1;
            }

            if (ball.y < ball.radius + wallThickness) {
                ball.dy = limitSpeed(-ball.dy * speedUpFactor);
                wallHitCount.current += 1;
            }

            if (
                ball.y + ball.radius >= paddle.y &&
                ball.x >= paddle.x &&
                ball.x <= paddle.x + paddle.width
            ) {
                ball.dy = -ball.dy;
            }

            if (ball.y > height) {
                if (!isGameOver.current) {
                    isGameOver.current = true;
                    alert('Game Over');
                    setIsRunning(false);  // ★ゲーム停止
                    setTimeout(() => {
                        document.location.reload();
                    }, 100);
                }
                return;
            }

            if (rightPressed && paddle.x + paddle.width < width) {
                paddle.x += paddle.speed;
            }
            if (leftPressed && paddle.x > 0) {
                paddle.x -= paddle.speed;
            }
        };

        // ★ drawをゲーム開始中のみ回すように修正
        const draw = () => {
            if (isGameOver.current || !isRunning) return; // ゲームオーバーか停止中なら描画停止

            ctx.clearRect(0, 0, width, height);
            drawWalls();
            drawBall();
            drawPaddle();
            update();

            requestAnimationFrame(draw);
        };

        if (isRunning) {
            draw();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [isRunning, darkMode]);  // darkModeも依存に追加

    // ★スペースキーでスタートさせる処理
    useEffect(() => {
        const handleStart = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !isRunning) {
                e.preventDefault();
                isGameOver.current = false;  // ゲーム再スタート
                wallHitCount.current = 0;
                setDisplayCount(0);
                setIsRunning(true);
            }
        };
        window.addEventListener('keydown', handleStart);
        return () => window.removeEventListener('keydown', handleStart);
    }, [isRunning]);

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100 gap-4">
            {!isRunning && <p>スペースキーでスタート</p>}
            {isRunning && <div>壁に当たった回数: {displayCount}</div>}
            <canvas ref={canvasRef} width={800} height={600} className="border border-gray-400" />
        </div>
    );
};

export default Game;
