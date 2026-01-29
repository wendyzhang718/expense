@echo off
chcp 65001 > nul
echo ========================================
echo GitHub 推送脚本
echo ========================================
echo.

echo 检查 Git 是否安装...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Git！
    echo.
    echo 请先安装 Git:
    echo 1. 访问: https://git-scm.com/download/win
    echo 2. 下载并安装
    echo 3. 重启终端后再运行此脚本
    echo.
    pause
    exit /b 1
)

echo Git 已安装！
echo.

echo 开始推送到 GitHub...
echo.

cd /d "%~dp0"

echo [1/6] 初始化 Git 仓库...
git init
if %errorlevel% neq 0 (
    echo 初始化失败！
    pause
    exit /b 1
)

echo [2/6] 配置 Git 用户信息...
git config user.name "wendyzhang718"
git config user.email "wendyzhang718@users.noreply.github.com"

echo [3/6] 添加所有文件...
git add .
if %errorlevel% neq 0 (
    echo 添加文件失败！
    pause
    exit /b 1
)

echo [4/6] 创建提交...
git commit -m "初始提交：费用 Dashboard 完成，数据已修复"
if %errorlevel% neq 0 (
    echo 提交失败！
    pause
    exit /b 1
)

echo [5/6] 设置远程仓库...
git remote remove origin 2>nul
git remote add origin https://github.com/wendyzhang718/expense.git
git branch -M main

echo [6/6] 推送到 GitHub...
echo.
echo 注意：如果需要登录，请使用 Personal Access Token 作为密码
echo Token 创建地址: https://github.com/settings/tokens
echo.
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo 推送失败！可能的原因：
    echo 1. 需要 GitHub 身份验证（使用 Personal Access Token）
    echo 2. 网络连接问题
    echo 3. 仓库已存在内容
    echo.
    echo 请手动执行: git push -u origin main
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ 推送成功！
echo ========================================
echo.
echo 请访问查看: https://github.com/wendyzhang718/expense
echo.
echo 现在可以回到 Vercel 刷新页面并重新导入仓库
echo.
pause
