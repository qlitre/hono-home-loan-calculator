import { hc } from 'hono/client'
import type { AppType } from '.'
import { useState, useRef } from 'hono/jsx'
import { render } from 'hono/jsx/dom'

const client = hc<AppType>('/')

function App() {
    return (
        <>
            <h1>住宅ローン簡易計算ツール</h1>
            <HomeLoneCalculator />
        </>
    )
}

function calcYearlyPayment(p: number, r: number, n: number) {
    let ng = 1
    let ok = 10000000000
    const rate = r / 100 + 1

    while (ok - ng > 0.0001) {
        // 万円で入力のため
        let rem = p * 10000
        console.log(rem, rate, n)
        const mid = (ok + ng) / 2
        for (let i = 0; i < n; i++) {
            rem -= mid
            rem *= rate
            if (rem < 0) break
        }
        if (rem < 0) {
            ok = mid
        } else {
            ng = mid
        }
    }
    return ok
}

function HomeLoneCalculator() {
    const principalRef = useRef<HTMLInputElement>(null)
    const interestRateRef = useRef<HTMLInputElement>(null)
    const yearsRef = useRef<HTMLInputElement>(null)
    const [result, setResult] = useState<number | null>(null)

    const handleCalculate = () => {
        const principal = principalRef.current?.value || '0'
        const interestRate = interestRateRef.current?.value || '0'
        const years = yearsRef.current?.value || '0'

        const P = parseFloat(principal)
        const r = parseFloat(interestRate)
        const n = parseInt(years)

        if (isNaN(P) || isNaN(r) || isNaN(n)) {
            alert('全てのフィールドに正しい数値を入力してください')
            return
        }

        if (P <= 0 || r <= 0 || n <= 0) {
            alert('0より大きい数を入力してください')
            return
        }
        if (P >= 1000000) {
            alert('100億円未満の金額を入力してください')
            return
        }

        if (r >= 10) {
            alert('利率は10％未満を入力してください')
            return
        }

        const yearlyPayment = calcYearlyPayment(P, r, n)
        setResult(yearlyPayment)
    }

    return (
        <div>
            <div>
                <label>
                    借入金額(万円):
                    <input type="number" ref={principalRef} />
                </label>
            </div>
            <div>
                <label>
                    利率 (%):
                    <input type="number" ref={interestRateRef} />
                </label>
            </div>
            <div>
                <label>
                    期間 (年):
                    <input type="number" ref={yearsRef} />
                </label>
            </div>
            <button onClick={handleCalculate}>計算</button>
            {result !== null && (
                <div>
                    <h2>年間の支払い額: ¥{Math.floor(result).toLocaleString()}</h2>
                </div>
            )}
        </div>
    )
}

const root = document.getElementById('root')!
render(<App />, root)