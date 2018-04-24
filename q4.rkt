#lang racket
(provide (all-defined-out))


; returns a list that is shift-left by one place of the given list
; Signature: shift-left(list)
; Purpose: shift-left
; Type: [list-> list]
;Example: (shift-left '(1 2 3 4 5)) should produce '(2 3 4 5 1)
(define shift-left
  (lambda (ls)
    (if (empty? ls)
       '()
       (append (cdr ls) (cons (car ls) null))
        )
    ))


; takes a list and a number k ≥ 0 and evaluates the list that is the given list’s shift-left k times
; Signature: shift-k-left(list int)
; Purpose: shift-left k times
; Type: [list-> list]
;Example: (shift-k-left '(1 2 3 4 5) 3) should produce '(4 5 1 2 3)
(define shift-k-left
  (lambda (ls k)
    (if (equal? k 0)
        ls
        (shift-k-left (shift-left ls) (- k 1))) ;by adding round brackets you evaluate 
        )
     )



; returns a list that is shift-right by one place of the given list
; Signature: shift-rightt(list int)
; Purpose: shift-right k times
; Type: [list-> list]
;Example: (shift-right '(1 2 3 4 5)) should produce '(5 1 2 3 4)
(define shift-right
  (lambda (ls)
      (if (empty? ls)
       '()
       (append (cons (last (cdr ls)) null) (take ls (- (length ls) 1))) ;check why cons
        )
    ))


;; Add a contract here
;(define combine
 ; (lambda (ls1 ls2)
 ;   (cond
   ;   [(empty? ls1) ls2]
    ;  [(empty? ls2) ls1]
     ; [else (append(append(cons(car ls1) null)(cons(car ls2) null))(combine (cdr ls1) (cdr ls2)))]  
    ;   )
   ; ))




; takes two lists and combines them in an alternating manner starting from the first list.
; Signature: combine(list1 list2)
; Purpose: combibng two lists in alternating manner
; Type: [list list-> list]
;Example: (combine '(1 2 3) '(a b c)) should produce '(1 a 2 b 3 c)
(define combine
  (lambda (ls1 ls2)
    (cond
      [(empty? ls1) ls2]
      [(empty? ls2) ls1]
      [else (let ([head (cons (car ls1) (cons (car ls2) '())) ])
              (let ([tail (combine (cdr ls1) (cdr ls2))])
                   (append head tail)
              ))]
    )
))



;receives a tree whose nodes’ data values are all numbers ≥ 0 and returns the sum of numbers
;present in all tree nodes
; Signature: sum-tree(tree)
; Purpose: sum all values of elements in a tree
; Type: [tree (list)-> int]
;Example: (sum-tree ’(5 (1 (2) (3))))should produce 11
(define sum-tree
  (lambda (tree)
    (if (empty? tree)
        0
        (foldl (lambda (value acc)(+ acc (sum-tree value)))
               (car tree)
               (cdr tree))
    ))
  )

; receives a tree whose nodes data values are numbers and booleans and returns the equivalent
;tree whose nodes satisfy the following:
;• If the equivalent node of the original tree is a number, then the resulting
;tree’s node is -1· that node value
;• If the equivalent node of the original tree is a boolean, then the resulting
;tree’s node is the logical not of that node value present in all tree nodes

; Signature: inverse-tree(tree)
; Purpose: invert values of elements in a tree (boolean-> logical not and number->-1 number)
; Type: [tree (list)-> tree(list)]
;Example:  (inverse-tree ’(-5 (1 (-2) (3) (#f)) (#t)))should produce ’(5 (-1 (2) (-3) (#t)) (#f))

(define inverse-tree
  (lambda (tree)
    (if (empty? tree)
        '()
        (let ([children (map inverse-tree (cdr tree))])
          (if (boolean? (car tree))
              (append (cons (not (car tree)) null) children)
              (append (cons (* (car tree) -1) null) children)
          )
        )
)))



