# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class LocalPageItem(scrapy.Item):
    name = scrapy.Field()
    category = scrapy.Field()
    area = scrapy.Field()
    phone = scrapy.Field()
