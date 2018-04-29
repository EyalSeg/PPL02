import { CExp, Exp, PrimOp, Program, DefineExp } from "./L1-ast";
import { hasError, isAppExp, isBoolExp, isCExp, isDefineExp, isError, isNumExp, isPrimOp,
         isProgram, isVarRef, isVarDecl } from "./L1-ast";
import { parseL1 } from "./L1-ast";
import { first, isEmpty, rest } from "./L1-ast";
import * as assert from "assert";
import { filter, map, reduce } from "ramda";
import { BoolExp, AppExp, getErrorMessages } from "./L3-ast";

// Implement the following function:
export const unparse = (x: Program | DefineExp | CExp) : string | Error => {
    return  isError(x) ? x : 
    isProgram(x) ? unparseProgram(x) : 
    isDefineExp(x) ? unparseDefineExp(x) :
    isCExp(x) ? unparseCExp(x) :
    ''
}

const unparseProgram = (x : Program) : string | Error => {
    if (hasError(x.exps))
        return new Error(getErrorMessages(x.exps))

    return x.exps.map((exp) => unparse(exp))
        .reduce((acc : string, curr : string) => acc + curr)
}

const unparseDefineExp = (x: DefineExp) : string | Error => {
    let val_unparsed = unparse(x.val)
    if (isError(val_unparsed))
        return val_unparsed

    return '(define ' + x.var.var +' ' + val_unparsed + ')'
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
    if (hasError(rands))
        return Error(getErrorMessages(rands))

    let rator =  unparseCExp(x.rator as CExp)
    if (isError(rator))
        return rator

    return '(' + rator + 
        rands.reduce((acc : string, curr) => acc + ' ' + curr, '') + ')'
}

console.log(unparse(parseL1("(L1 " + 
    "(define x 5)"+
    "(+ x 5)"+
    "(+ (+ (- x y) 3) 4)"+
    "(and #t x))"))); 