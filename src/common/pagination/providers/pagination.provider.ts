import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express'
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interface/paginated.interface';
@Injectable()
export class PaginationProvider {

    constructor(
        /**
         * Inject request
         */
        @Inject(REQUEST)
        private readonly request: Request
    ) { }

    public async paginateQuery<T extends ObjectLiteral>(
        paginationQuery: PaginationQueryDto,
        repository: Repository<T>
    ): Promise<Paginated<T>> {
        let items = await repository.find({
            skip: (paginationQuery.page - 1) * paginationQuery.limit,
            take: paginationQuery.limit
        })

        /**
         * Create the request URLs
         */
        const baseURL = this.request.protocol + '://' + this.request.headers.host + '/';

        const newURL = new URL(this.request.url, baseURL);

        /**
         * Calculating page number 
         */
        const totalItems = await repository.count();
        const totalPages = Math.ceil(totalItems / paginationQuery.limit);
        const nextPage = paginationQuery.page === totalPages ? paginationQuery.page : paginationQuery.page + 1;
        const previousPage = paginationQuery.page === totalPages ? paginationQuery.page : paginationQuery.page - 1;

        const finalResponse: Paginated<T> = {
            data: items,
            meta: {
                itemsPerPage: paginationQuery.limit,
                totalItems: totalItems,
                currentPage: paginationQuery.page,
                totalPages: totalPages
            },
            links: {
                first: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=1`,
                last: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
                current: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
                next: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
                previous: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${previousPage}`,
            }
        }

        return finalResponse;
    }
}

