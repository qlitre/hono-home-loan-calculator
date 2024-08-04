import { hc } from 'hono/client'
import type { AppType } from '.'
import { useState, useRef } from 'hono/jsx'
import { render } from 'hono/jsx/dom'
import { css } from 'hono/css'

const client = hc<AppType>('/')

function App() {
    return (
        <>
            <h1>住宅ローン簡易計算ツール</h1>
            <HomeLoneCalculator />
            <Footer />
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

    const handleCalculate = (e: Event) => {
        e.preventDefault()
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
        if (P > 100000) {
            alert('10億円以下の金額を入力してください')
            return
        }

        if (r > 10) {
            alert('利率は10％以下を入力してください')
            return
        }

        if (n > 100) {
            alert('期間は100年以下を入力してください')
            return
        }

        const yearlyPayment = calcYearlyPayment(P, r, n)
        setResult(yearlyPayment)
    }
    const y = Number(yearsRef.current?.value || '0')
    return (
        <div>
            <form onSubmit={handleCalculate}>
                <div>
                    <label>
                        借入金額(万円):
                    </label>
                    <input type="number" ref={principalRef} />

                </div>
                <div>
                    <label>
                        利率 (%):
                    </label>
                    <input type="number" ref={interestRateRef} />

                </div>
                <div>
                    <label>
                        期間 (年):
                    </label>
                    <input type="number" ref={yearsRef} />
                </div>
                <button type='submit' onClick={handleCalculate}>計算</button>
            </form>
            {result !== null && (

                <div>
                    <h3>毎月の支払い額: ¥{Math.floor(result / 12).toLocaleString()}</h3>
                    <h3>年間の支払い額: ¥{Math.floor(result).toLocaleString()}</h3>
                    <h3>合計の支払い額: ¥{(Math.floor(result) * y).toLocaleString()}</h3>
                </div>
            )}
        </div>
    )
}

function Footer() {
   
    return (
        <footer>
            <p>This site is powered by 🔥Hono.</p>
        </footer>
    )
}

const root = document.getElementById('root')!
render(<App />, root)