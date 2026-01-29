@echo off
chcp 65001 > nul
setlocal

set GIT="C:\Program Files\Git\bin\git.exe"
set PROJECT_DIR=%~dp0

echo ========================================
echo 推送代码到 GitHub
echo ========================================
echo.

cd /d "%PROJECT_DIR%"

echo [1/7] 配置 Git 用户信息...
%GIT% config user.name "wendyzhang718"
%GIT% config user.email "wendyzhang718@users.noreply.github.com"

echo [2/7] 初始化 Git 仓库...
%GIT% init

echo [3/7] 添加所有文件...
%GIT% add .

echo [4/7] 创建提交...
%GIT% commit -m "初始提交：费用 Dashboard 完成，数据已修复"

echo [5/7] 设置分支为 main...
%GIT% branch -M main

echo [6/7] 添加远程仓库...
%GIT% remote remove origin 2>nul
%GIT% remote add origin https://github.com/wendyzhang718/expense.git

echo [7/7] 推送到 GitHub...
echo.
echo 注意：如果需要登录，请使用 Personal Access Token
echo.
%GIT% push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ 推送成功！
    echo ========================================
    echo.
    echo 请访问: https://github.com/wendyzhang718/expense
    echo.
) else (
    echo.
    echo ========================================
    echo ⚠️ 推送需要身份验证
    echo ========================================
    echo.
    echo 请创建 Personal Access Token:
    echo 1. 访问: https://github.com/settings/tokens
    echo 2. 点击 "Generate new token (classic)"
    echo 3. 勾选 "repo" 权限
    echo 4. 生成并复制 Token
    echo 5. 重新运行此脚本，使用 Token 作为密码
    echo.
)

pause
