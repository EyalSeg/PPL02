import { CExp, Exp, PrimOp, Program, DefineExp } from "./L1-ast";
import { hasError, isAppExp, isBoolExp, isCExp, isDefineExp, isError, isNumExp, isPrimOp,
         isProgram, isVarRef, isVarDecl } from "./L1-ast";
import { parseL1 } from "./L1-ast";
import { first, isEmpty, rest } from "./L1-ast";
import * as assert from "assert";
import { filter, map, reduce } from "ramda";
import { BoolExp, AppExp } from "./L3-ast";

// Implement the following function:
export const unparse = (x: Program | DefineExp | CExp) : string | Error => {
    return isProgram(x) ? unparseProgram(x) : 
    isDefineExp(x) ? unparseDefineExp(x) :
    isCExp(x) ? unparseCExp(x) :
    ''
}

const unparseProgram = (x : Program) : string | Error => {
    return x.exps.map((exp) => unparse(exp))
        .reduce((acc : string, curr : string) => acc + curr)
}

const unparseDefineExp = (x: DefineExp) : string | Error => {
    return '( define ' + x.var.var + unparse(x.val) + ')'
}

const unparseCExp = (x : CExp) : string | Error => {
    return isNumExp(x)? x.val.toString() :
    isBoolExp(x)? unparseBoolean(x) :
    isPrimOp(x)? x.op :
    isVarRef(x)? x.var :
    isVarDecl(x)? '(let ' + x.var + ')':
    isAppExp(x)? unparseApp(x as AppExp):
    ''
}

const unparseBoolean = (x : BoolExp) : string => {
    return x.val? '#t' : '#f'
}

const unparseApp = (x: AppExp) => {
    let rands = x.rands.map((rand) => unparse(rand as DefineExp | CExp))

    return '(' + unparseCExp(x.rator as CExp) + 
        rands.reduce((acc : string, curr) => acc + ' ' + curr, '') + ')'
}

console.log(unparse(parseL1("(L1 " + 
    "(define x 5)"+
    "(+ x 5)"+
    "(+ (+ (- x y) 3) 4)"+
    "(and #t x))"))); 