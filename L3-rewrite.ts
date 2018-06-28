import { filter, map, reduce, zip } from "ramda";
import { first, isArray, isBoolean, isEmpty, isNumber, isString, rest, second, isLetStarExp, makeLetExp, makeLetStarExp, LetStarExp, LetExp, makeProgram, makeDefineExp, isVarDecl, makeBinding, isBinding, isAtomicExp, Binding, isCompoundExp } from "./L3-ast";
import { AppExp, AtomicExp, BoolExp, CompoundExp, CExp, DefineExp, Exp, IfExp, LitExp, NumExp,
         Parsed, PrimOp, ProcExp, Program, StrExp, VarDecl, VarRef } from "./L3-ast";
import { allT, getErrorMessages, hasNoError, isError }  from "./L3-ast";
import { isAppExp, isBoolExp, isCExp, isDefineExp, isExp, isIfExp, isLetExp, isLitExp, isNumExp,
             isPrimOp, isProcExp, isProgram, isStrExp, isVarRef } from "./L3-ast";
import { makeAppExp, makeBoolExp, makeIfExp, makeLitExp, makeNumExp, makeProcExp, makeStrExp,
         makeVarDecl, makeVarRef } from "./L3-ast";
import { parseL3 } from "./L3-ast";
import { isClosure, isCompoundSExp, isEmptySExp, isSymbolSExp, isSExp,
         makeClosure, makeCompoundSExp, makeEmptySExp, makeSymbolSExp,
         Closure, CompoundSExp, SExp, Value } from "./value";
import { hasError } from "./L1-ast";

export const rewriteLetStar = (cexp: Parsed | Error) : LetExp  | Error => 
{
    if (!isLetStarExp(cexp))
        return Error("expected let* exp ")

    let letStar = cexp as LetStarExp

    //to do check if bindings are 0
    if (letStar.bindings.length == 1)
        return makeLetExp(letStar.bindings, letStar.body)

    let bindingHead = [letStar.bindings[0]]

    // Make a let* with all bindings except the first, recursively turn it into a let
    // append it to a let binding the first bind only
    let nestedLetStar = makeLetStarExp(letStar.bindings.slice(1), letStar.body)
    let nestedLet = rewriteLetStar(nestedLetStar)

    if (isError(nestedLet))
        return nestedLet

    return makeLetExp(bindingHead, [nestedLet])
}


export const rewriteAllLetStar = (cexp: Parsed | Binding | Error) : Parsed | Binding | Error =>
{
    return isError(cexp) ? cexp :
    isBinding(cexp)? rewriteAllLetStarBinding(cexp) :
    isExp(cexp) ? rewriteAllLetStarExp(cexp) :
    isProgram(cexp) ? makeProgram(map(rewriteAllLetStarExp, cexp.exps)) :
    cexp;
}

const rewriteAllLetStarBinding = (bind : Binding) : Binding => 
    makeBinding(bind.var, rewriteAllLetStarCExp(bind.val))


const rewriteAllLetStarExp = (exp: Exp): Exp =>
    isCExp(exp) ? rewriteAllLetStarCExp(exp) :
    isDefineExp(exp) ? makeDefineExp(exp.var, rewriteAllLetStarCExp(exp.val)) :
    exp;

const rewriteLetStar_Nested = (letStarExp) : LetExp | Error =>{
    let body_rewritten = letStarExp.body.map((x) => rewriteAllLetStarCExp(x))
    if (hasError(body_rewritten))
        return new Error(getErrorMessages(body_rewritten))

    let newBindings = letStarExp.bindings.map((bind) => rewriteAllLetStar(bind))
    let letexp = rewriteLetStar(makeLetStarExp(newBindings, body_rewritten)) 
    return letexp
}

const rewriteAllLetStarCExp = (exp: CExp): CExp =>
{
    let returnval = isAtomicExp(exp) ? exp :
    isLitExp(exp) ? exp :
    isIfExp(exp) ? makeIfExp(rewriteAllLetStarCExp(exp.test),
                             rewriteAllLetStarCExp(exp.then),
                             rewriteAllLetStarCExp(exp.alt)) :
    isAppExp(exp) ? makeAppExp(rewriteAllLetStarCExp(exp.rator),
                               map(rewriteAllLetStarCExp, exp.rands)) :
    isProcExp(exp) ? makeProcExp(exp.args, map(rewriteAllLetStarCExp, exp.body)) :
    isLetExp(exp) ? makeLetExp(exp.bindings.map((bind) => rewriteAllLetStarBinding(bind)),
         map(rewriteAllLetStarCExp, exp.body)):
    isLetStarExp(exp) ? rewriteLetStar_Nested(exp) as LetExp :
    exp;

    return returnval
}




console.log(JSON.stringify(rewriteAllLetStar(parseL3
    ("(let* ((x (let* ((y 5)) y)) (z 7)) (+ x (let* ((t 12)) t)))")),
    null,4));

// MOM, LOOK AT ME! I'M A CODE MONKEY
//     __,__
//     .--.  .-"     "-.  .--.
//    / .. \/  .-. .-.  \/ .. \
//   | |  '|  /   Y   \  |'  | |
//   | \   \  \ 0 | 0 /  /   / |
//    \ '- ,\.-"`` ``"-./, -' /
//     `'-' /_   ^ ^   _\ '-'`
//     .--'|  \._ _ _./  |'--.
//   /`    \   \.-.  /   /    `\
//  /       '._/  |-' _.'       \
// /          ;  /--~'   |       \
// /        .'\|.-\--.     \       \
// /   .'-. /.-.;\  |\|'~'-.|\       \
// \       `-./`|_\_/ `     `\'.      \
// '.      ;     ___)        '.`;    /
//  '-.,_ ;     ___)          \/   /
//   \   ``'------'\       \   `  /
//    '.    \       '.      |   ;/_
// jgs  ___>     '.       \_ _ _/   ,  '--.
// .'   '.   .-~~~~~-. /     |--'`~~-.  \
// // / .---'/  .-~~-._/ / / /---..__.'  /
// ((_(_/    /  /      (_(_(_(---.__    .'
//        | |     _              `~~`
//        | |     \'.
//         \ '....' |
//          '.,___.'
