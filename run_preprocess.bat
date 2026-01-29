@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo 费用数据预处理脚本
echo ============================================================
echo.

cd /d "d:\cursor\WorkPlace\Expense New Dashboard"

echo 正在查找 Python...
echo.

:: 尝试方法 1: py 启动器
where py >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo 找到 py 启动器
    py -c "print('Python 可用')" >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo 使用 py 启动器运行脚本...
        echo.
        py scripts\preprocess_data.py
        goto :check_result
    )
)

:: 尝试方法 2: python 命令
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo 找到 python 命令
    python -c "print('Python 可用')" >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo 使用 python 命令运行脚本...
        echo.
        python scripts\preprocess_data.py
        goto :check_result
    )
)

:: 尝试方法 3: python3 命令
where python3 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo 找到 python3 命令
    python3 -c "print('Python 可用')" >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo 使用 python3 命令运行脚本...
        echo.
        python3 scripts\preprocess_data.py
        goto :check_result
    )
)

:: 如果所有方法都失败
echo.
echo 错误: 找不到可用的 Python 安装！
echo.
echo 请确保 Python 已正确安装并添加到 PATH 环境变量。
echo.
echo 您可以尝试：
echo 1. 重新安装 Python，并勾选 "Add Python to PATH"
echo 2. 手动添加 Python 到系统环境变量
echo 3. 在命令行中运行: py scripts\preprocess_data.py
echo.
pause
exit /b 1

:check_result
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ============================================================
    echo 脚本执行失败，错误代码: %ERRORLEVEL%
    echo ============================================================
    echo.
    echo 可能的原因：
    echo 1. pandas 未安装 - 运行: py -m pip install pandas
    echo 2. CSV 文件不存在或路径错误
    echo 3. 权限问题 - 以管理员身份运行
    echo.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ============================================================
echo 处理完成！
echo ============================================================
echo.
echo 生成的文件: public\data\expenses.json
echo.
pause
