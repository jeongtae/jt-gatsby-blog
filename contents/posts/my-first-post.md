---
title: My First Post
date: 2019-07-10
tags: [javascript, react]
---


# Header 1
Today, I'm "gonna" introduce how to make a pie.
Let's get started. No inside the `<< code >> "area"`{: .red}
---
First of all, ~~

!!! note
    You should not read this.

!!! warning green exclamation
    You should not read this.

!!! warning yellow check
    You should not read this.

!!! warning red stop
    You should not read this.

4. Hello
5. World

## Header 2
Lorem
### Header 3
Lorem
#### Header 4
Lorem
##### Header 5
Lorem
###### Header 6
Lorem

asterisks *one* and **two** underlines _one_ and __two__ inline code `a = 10` line ~~Double Tilde~~ <u>UNDERLINE</u>

> 남의 말을 귀담아 듣자

| Name | Gender | Age |
|------:|:------:|----:|
| John | male| 25|
| Juliet| female| 19|
| Chloe | female| 21|

```python hl_lines="1 3"
    def save(self, *args, **kwargs):
        for (language,_) in settings.LANGUAGES:
            markdown = getattr(self, f"markdown_{language}")
            html = markdownify(markdown)
            setattr(self, f"markdown_converted_{language}", html)
            super().save(*args, **kwargs)
```

# 목록

## 순서있는 목록 기본 표기법

1. First Line
2. Second Line

## 순서있는 목록 다른 표기법

1. First Line
1. Second Line

## 순서 없는 목록 세가지 표기법

- Hyphen
* Asterisks
+ Plus Sign 

## 서브 목록
1. First Item
   - Sub Item 1
   - Sub Item 2
2. Second Item

# 링크

## 기본 링크
https://google.com <https://naver.com> 

## 이름이 보이는 링크
[Google](http://127.0.0.1:8000/posts/)

## 이름이 보이고 title 속성있는 링크
[Naver](https://google.com "Link to Naver")

## 상대참조 링크
[Login](../)

## Link
[Daum]

--- 
> Hello
> World
>> Double

[Daum]: https://daum.net "Link to Daum"
